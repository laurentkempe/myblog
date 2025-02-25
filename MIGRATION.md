# Rename *.md to .mdx

```powershell
Get-ChildItem -Path ".\src\content\posts\2010" -Filter *.md -Recurse | Rename-Item -NewName { $_.Name -replace '\.md$','.mdx' }
```

# Replace old excerpt

Find and replace all "<!-- more -->" by "{/* <!-- more --> */}" in *.mdx starting from a folder

```powershell
Get-ChildItem -Path ".\src\content\posts\2010" -Filter "*.mdx" -Recurse | ForEach-Object { (Get-Content $_.FullName) -replace '<!-- more -->', '{/* <!-- more --> */}' | Set-Content $_.FullName }
```

# Replace <?! alert ?>

In all *.mdx files in a folder replace using regex from "<?! alert info ?>" to "<?!/ alert ?>" by "<Alert mode="info">" and "</Alert>"

```powershell
Get-ChildItem -Recurse -Path ".\src\content\posts\2010" -Filter "*.mdx" | ForEach-Object { $content = Get-Content $_.FullName -Raw; $content = $content -replace '\<\?! alert info \?\>', '<Alert mode="info">'; $content = $content -replace '\<\?!/ alert \?\>', '</Alert>'; Set-Content $_.FullName -Value $content -NoNewline }
```

In all *.mdx files in a folder replace using regex replace "<?! alert warning ?>" to "<?!/ alert ?>" by "<Alert mode="warning">" and "</Alert>"

```powershell
Get-ChildItem -Recurse -Path ".\src\content\posts\2010" -Filter "*.mdx" | ForEach-Object { $content = Get-Content $_.FullName -Raw; $content = $content -replace '\<\?! alert warning \?\>', '<Alert mode="warning">'; $content = $content -replace '\<\?!/ alert \?\>', '</Alert>'; Set-Content $_.FullName -Value $content -NoNewline }
```

# Replace githubCard

In all *.mdx files in a folder replace using regex replace "<?# githubCard user=laurentkempe repo=grpcAsyncStreamCancellation align=left /?>" by "<GitHubCard user="laurentkempe" repo="grpcAsyncStreamCancellation" />"

```powershell
Get-ChildItem -Recurse -Path ".\src\content\posts\2010" -Filter "*.mdx" | ForEach-Object { $content = Get-Content $_.FullName -Raw; $content = $content -replace '\<\?# githubCard user=([^ ]+) repo=([^ ]+) align=left /\?>', '<GitHubCard user="$1" repo="$2" />'; Set-Content $_.FullName -Value $content -NoNewline }
```

# Replace Plyr

In all *.mdx files in a folder replace using regex the "<?# Plyr video=o0XLGRObd4E start=291 /?>" by "<Plyr video="o0XLGRObd4E" start="291" />". Consider the start parameter as being optional.

```powershell
Get-ChildItem -Recurse -Path ".\src\content\posts\2010" -Filter "*.mdx" | ForEach-Object { $content = Get-Content $_.FullName -Raw; $content = $content -replace '\<\?# Plyr video=([^ ]+) start=([0-9]+) /\?\>', '<Plyr video="$1" start="$2" />'; $content = $content -replace '\<\?# Plyr video=([^ ]+) /\?\>', '<Plyr video="$1" />'; Set-Content $_.FullName -Value $content -NoNewline }
```

# Replace images

In all *.mdx files in a folder replace "<?# image center clear group=azuredevops https://farm8.staticflickr.com/7807/32349146347_f88d9b1fce_o.png alt="Azure DevOps Release pipeline"/?>" by "<Image src="https://farm8.staticflickr.com/7807/32349146347_f88d9b1fce_o.png" alt="Azure DevOps Release pipeline" class="container mx-auto px-4 py-4 flex flex-col sm:flex-row max-w-[640px]" />"

```powershell
Get-ChildItem -Recurse -Path ".\src\content\posts\2010" -Filter "*.mdx" | ForEach-Object { $content = Get-Content $_.FullName -Raw; $content = $content -replace '\<\?# image center clear group=([^ ]+) ([^ ]+) alt="([^"]+)" /\?\>', '<Image src="$2" alt="$3" class="container mx-auto px-4 py-4 flex flex-col sm:flex-row max-w-[640px]" />'; Set-Content $_.FullName -Value $content -NoNewline }
```
