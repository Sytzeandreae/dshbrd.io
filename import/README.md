# Import Folder

Drop recipes here to be formatted and added to your collection.

## How to Import

1. **Copy your recipe** into this folder
   - Any format works: plain text, markdown, copy-paste from a website
   - Name it anything — it will be renamed during formatting

2. **Ask Claude to format it**
   ```
   Format the recipes in my import folder
   ```

3. **Claude will:**
   - Read and understand your recipe
   - Reformat it to match the standard template
   - Identify the correct cuisine category
   - Save it to `recipes/{cuisine}/{recipe-name}.md`
   - Update `INDEX.md` with the new recipe
   - Delete the original file from this folder

## Tips

- You can drop multiple recipes at once
- Include any notes about the recipe (where you got it, modifications you like)
- If the cuisine is ambiguous, Claude will ask
