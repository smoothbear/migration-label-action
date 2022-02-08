import * as core from '@actions/core';
import * as constants from './constants';
import * as github from '@actions/github';
import { addMigrationLabel, getChangedFiles, getPrNumber } from './pull_request';
import { ClientType } from './types';

async function run() {
    try {
        const ownerInput = core.getInput(constants.REPO_OWNER);
        const owner = ownerInput !== '' ? ownerInput : github.context.repo.owner;

        const labelNameInput = core.getInput(constants.LABEL_NAME);
        const labelName = labelNameInput !== '' ? labelNameInput : constants.LABEL_DEFAULT_NAME;

        const token = core.getInput(constants.GITHUB_TOKEN, { required: true });
        const client: ClientType = github.getOctokit(token);

        const prNumber = getPrNumber();

        if (!prNumber) {
            core.error('Failed to get pull request information!');
            throw new Error('failed to get pull request');
        }

        const { data: pullRequest } = await client.rest.pulls.get({
            owner: owner === '' ? owner : github.context.repo.owner,
            repo: github.context.repo.repo,
            pull_number: prNumber
        });

        const changedFiles: string[] = await getChangedFiles(client, prNumber, owner);

        const migrationRe = /\bmigrations\b/g;
        const existLabels = pullRequest.labels.map(label => (label.name ? label.name : ''));

        for (const changedFile of changedFiles) {
            if (changedFile.match(migrationRe)) {
                await addMigrationLabel(client, prNumber, owner, labelName, existLabels);
                break;
            }
        }
    } catch (error: any) {
        core.setFailed(error.message);
    }
}

run();
