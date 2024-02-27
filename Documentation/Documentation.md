# Prerequisites
Binary lab is built on **BETH** stack but **with PostgreSQL** instead of ~~Turso~~. Make sure to install:
- [Bun](https://bun.sh) - Runtime environment for JavaScript
- [PostgreSQL](https://www.postgresql.org) - Object relational database
# Installation & quick run
You can easily get this project running just by cloning this repo, installing the dependencies and running the `dev` script.
## Start PostgreSQL service
Most of the time PostgreSQL service start along with system, incase if it doesn't, you can manually start it by:
### For Windows
Open PowerShell as administrator. As it for now (03/12/2023), Bun is not available for windows yet. So it has to WSL. WSL1 is recommended as it is faster and avoid unmercenary network configuration to make windows PostgreSQL work with Bun.
```powershell
net start postgresql-x64-16
```
### For Linux
Open bash, initialize PostgreSQL and start the service
```bash
# initialize db
sudo service postgresql-16 initdb
# start db service
sudo service postgresql-9.3 start
```
## Get a local copy
You can either clone this repo or download as zip. Here's the easiest way, cloning with git
```bash
git clone https://github.com/AGSCRAFT-SOFTWARE-SOLUTIONS/binary-lab.git
cd binary-lab
```
## Install dependencies
```bash
bun install
```
## Start the server
```bash
bun dev
# The output should be:
🦊 running at https://localhost:3000
```
If you followed above steps correctly and seeing the expected output, you're good to go. You can go to [http://localhost:3000](http://localhost:300) and see the Binary lab project running locally
# File structure
```
root
|- public
| |- assets
| |- stylesheets
|- src
| |- components
| |- lib
| |- pages
| |- stylesheets
| |- types
| |- server.tsx
|- .env
|- *config.{ts,json}
```
## Let me explain the file structure:
- `root` - The root directory of the project.
- `public` - The folder served by the server as [static folder](link to explain what a static folder is). It contains assets and stylesheets to be accessed by the website.
- `src` - Where all code lies. `src` folder contains a `server.tsx` file and other files grouped grouped as folders based on their functionalities.
- `server.tsx` - Where the Elysia server is running from.
- `pages` - Contains `.tsx` files each pages. Note, I consider one as page, only if it has respective link in the navigation bar. Anything that's not linked in navigation bar is not considered as page. (Header is not nav)
- `components` - Contains components for pages.
- `lib` - Contains Database and Authentication files.
- `stylesheets` - Contains stylesheets. Stylesheet's names are respective to their target page or component.
- `types` - Contains types. e.g. for data retrieved from database.
- `.env` - Holds environment variables
- `*.config` - Configuration files for respective dependencies.