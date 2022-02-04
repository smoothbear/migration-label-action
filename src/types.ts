import { getOctokit } from '@actions/github';

export type ClientType = ReturnType<typeof getOctokit>;
