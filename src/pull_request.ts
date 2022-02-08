import * as core from '@actions/core';
import * as github from '@actions/github';
import { ClientType } from './types';

export function getPrNumber(): number | undefined {
    const pullRequest = github.context.payload.pull_request;
    if (!pullRequest) {
        return undefined;
    }

    return pullRequest.number;
}

export async function getChangedFiles(
    client: ClientType,
    prNumber: number,
    owner: string
): Promise<string[]> {
    const fileOptionList = client.rest.pulls.listFiles.endpoint.merge({
        owner: owner,
        repo: github.context.repo.repo,
        pull_number: prNumber
    });

    const listFilesResponse = await client.paginate(fileOptionList);
    const changedFiles = listFilesResponse.map((f: any) => f.filename);

    return changedFiles;
}

export async function addMigrationLabel(
    client: ClientType,
    prNumber: number,
    owner: string,
    labelName: string,
    existLabels: string[],
) {
    core.info(`${labelName} will be added`);
    core.info('Adding migration labels..');

    existLabels.push(labelName);

    return await client.rest.issues.addLabels({
        owner: owner,
        repo: github.context.repo.repo,
        issue_number: prNumber,
        labels: existLabels
    });
}
