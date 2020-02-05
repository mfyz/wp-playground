#!/usr/bin/env node

const util = require('util')
const exec = util.promisify(require('child_process').exec)

const wpcli = 'docker-compose run --rm wpcli'
const dockerRun = 'docker run --volume wp-playground_wordpress:/var/www/html --rm alpine'

// See colors http://bit.ly/2slMFug
const cReset = "\x1b[0m"
const cFgRed = "\x1b[31m"
const cFgYellow = "\x1b[33m"
const cFgGreen = "\x1b[32m"

const runCmd = async (cmd) => {
	try {
		const { stdout, stderr } = await exec(cmd)
		console.log(`${cFgGreen}✔ Done${cReset}`)
		if (stdout) { console.log(stdout) }
	}
	catch (e) {
		console.log(`${cFgRed}Command Failed:${cReset}`)
		console.log(e.stderr)
		process.exit(-2)
	}
}

const main = async () => {
	console.log(`==> ${cFgYellow}Setting permissions and ownership for wp-content folder${cReset}`)
	await runCmd(`${dockerRun} chown -R xfs:xfs /var/www/html/wp-content`)
	await runCmd(`${dockerRun} chmod -R 777 /var/www/html/wp-content`)

	console.log(`==> ${cFgYellow}Installing wordpress site with admin account${cReset}`)
	await runCmd(`${wpcli} core install\
		--url=http://localhost:6001\
		--title='Test Site'\
		--admin_user=admin\
		--admin_password=admin\
		--admin_email=test@example.com\
		--skip-email`)

	// console.log(`==> ${cFgYellow}Install required plugins${cReset}`)
	// await runCmd(`${wpcli} plugin install kirki --activate`)

	// console.log(`==> ${cFgYellow}Activate the theme${cReset}`)
	// await runCmd(`${wpcli} theme activate mytheme`)

	// Other wp options to change
	// wp option update page_on_front 5
	// wp option update page_for_posts 10
	// wp option update show_on_front page
	// wp rewrite structure '/%postname%/' --hard
}

main()
