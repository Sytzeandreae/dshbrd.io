# Recipe Collection

A personal collection of deeply flavorful, make-ahead friendly recipes with proper technique explanations.

## Features

- **Technique-focused** — Recipes explain the "why" behind every step
- **Make-ahead friendly** — Every recipe includes storage and reheating guidance
- **Scalable ingredients** — Adjust servings with interactive +/- buttons
- **Organized by cuisine** — French, Italian, Indian, and more

## Running Locally

Requires Ruby 2.7+ (recommend using [rbenv](https://github.com/rbenv/rbenv)):

```bash
# Install dependencies
bundle install

# Start the development server
bundle exec jekyll serve
```

Visit `http://localhost:4000` to view the site.

## Recipe Format

Recipes are Markdown files with YAML frontmatter:

```markdown
---
title: "Recipe Name"
cuisine: italian
protein: chicken
prepTime: 30
cookTime: 45
totalTime: 75
serves: 6
tags:
  - make-ahead
  - freezable
ingredients:
  - group: "Main Ingredients"
    items:
      - qty: 900
        unit: "g"
        item: "chicken thighs"
---

## Recipe Name

*Brief introduction...*

### Method

1. **First step.** Instructions...
```

## Adding Recipes

1. Create a new `.md` file in `_recipes/[cuisine]/`
2. Follow the frontmatter format above
3. The site will automatically include it

## License

Personal recipe collection. Recipes are for personal use.
