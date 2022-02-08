# Migration Label

A workflow for detecting and automatically labeling migration changes.

### Usage
```yml
name: migration-label

on: 
    pull_request

jobs:
  migration-label:
    runs-on: ubuntu-latest
    steps:
      - name: migration-label
        uses: smoothbear/migration-label-action@v1
        with:
          token: "${{ secrets.GITHUB_TOKEN }}"
```

### Parameter
|name|description|required|
|`label-name`|Will be added label's name|false|
|`owner`|A repository owner username. |false|
|`token`|Personal access token. If you didn't define owner, use `${{ secrets.GITHUB_TOKEN}}|true|
