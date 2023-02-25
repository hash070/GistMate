# GistMate

GistMate is a web application that helps you manage and organize your Gist notes on GitHub. It allows you to easily create, edit, and search for Gist notes, as well as add tags and bookmarks to them for better organization.

With GistMate, you can get the most out of GitHub Gist's reliable and convenient note-taking service. It enhances your Gist experience by adding search, tag, and bookmark features that are not available on the official GitHub Gist website.

## Features

- [x] Create, edit, and delete Gist notes on GitHub
- [x] `i-18n` localization support
  - [x] English
  - [x] Japanese
  - [x] Chinese
- [x] Integrate with GitHub OAuth
- [x] Upload and attach images to your Gists
- [ ] Search for Gist notes by title, content, or tag
- [ ] Tag Gist notes for better organization and management
- [ ] Bookmark Gist notes for quick access
- [ ] Strong encryption for Gist notes with `OpenPGP.js`
- [ ] Export and import Gist notes for backup

Powerful markdown previewer and editor, powered by [vue-markdown-editor](https://github.com/code-farmer-i/vue-markdown-editor)
  - [x] Image upload
  - [x] Tip
  - [x] Emoji
  - [x] Katex
  - [x] Mermaid (flowchart)
  - [x] Line Number
  - [x] Highlight Lines
  - [x] Copy Code
  - [x] Align

## How to Use

1. Log in with your GitHub account on [GistMate](https://gistmate.hash070.com/) or create a gist access key in [GitHub developer settings](https://github.com/settings/tokens)

![image](https://user-images.githubusercontent.com/62081013/221338892-d5ceb210-61fa-49e7-9a94-fc952f318847.png)

2. Create and edit your Gist notes

Click the `New Gist Collection` button on the menu button

![newgistcollection](https://user-images.githubusercontent.com/62081013/221339746-5fbc581e-569e-4cd9-830c-e74152574e34.png)

Enter the new gist collection name and the first file name

![image](https://user-images.githubusercontent.com/62081013/221339799-58b0f78b-5c58-4a1b-9702-72c824f96095.png)

Click the first switch to edit the gist

![image](https://user-images.githubusercontent.com/62081013/221339813-b7cc6404-a3b0-4989-b7a2-abe032568204.png)

Use `Ctrl+S` shortcut Or click save button on the editor or wait for 3 sconds when `AutoSave` is on or click the first switch on the top tool bar.

![image](https://user-images.githubusercontent.com/62081013/221339903-48112797-2e63-4739-9e7f-f62ab87479f7.png)

Click the first switch again to view your gist

![image](https://user-images.githubusercontent.com/62081013/221339919-ca63b56f-d330-49e4-904a-e92d1bc47f37.png)

## Technologies Used

- [GitHub API](https://docs.github.com/en/rest?apiVersion=2022-11-28) - RESTful API for accessing GitHub Gist notes
- [Vue.js](https://vuejs.org/) - Front-end JavaScript framework
- [vue-i18n](https://vue-i18n.intlify.dev/) - Internationalization plugin for Vue.js
- [NodeJS](https://nodejs.org/) - A JavaScript runtime built on Chrome's V8 JavaScript engine.
- [NestJS](https://nestjs.com/) - A progressive Node.js framework for building efficient, reliable and scalable server-side applications.
- [vue-markdown-editor](https://code-farmer-i.github.io/) - A markdown editor component for Vue.js

## Development

To run and develop GistMate on your local machine, follow these steps:

1. Clone the repository: `git clone https://github.com/hash070/gistmate.git`
2. Enter frontend directory: `cd gistmate/frontend`
3. Install dependencies: `pnpm install`
4. Start the development server: `pnpm dev`

## License

GistMate is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.