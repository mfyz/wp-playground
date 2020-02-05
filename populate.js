#!/usr/bin/env node

const util = require('util')
const exec = util.promisify(require('child_process').exec)
const generateData = require('./populate-data')

const wpcli = 'docker-compose run --rm wpcli'

// See colors http://bit.ly/2slMFug
const cReset = "\x1b[0m"
const cFgRed = "\x1b[31m"
const cFgYellow = "\x1b[33m"
const cFgGreen = "\x1b[32m"
const cFgBlue = "\x1b[34m"

const runCmd = async (cmd) => {
	try {
		const { stdout, stderr } = await exec(cmd)
		console.log(`${cFgGreen}✔ Done${cReset}`)
		if (stdout) {
			console.log(stdout)
		}
	}
	catch (e) {
		console.log(`${cFgRed}Command Failed:${cReset}`)
		console.log(e.stderr)
		process.exit(-2)
	}
}

const main = async () => {
	let post = {}

	console.log(`==> ${cFgBlue}Generating sample pages (${generateData.pages.length})${cReset}`)
	for (let i = 0; i < generateData.pages.length; i += 1) {
		post = generateData.pages[i]
		console.log(`==> ${cFgYellow}Page: ${post.title}${cReset}`)
		await runCmd(`${wpcli} post create \
			--post_type=page \
			--post_status=publish \
			--post_title="${post.title}" \
			--post_content="${post.body}"`)
	}
	
	console.log(`\n==> ${cFgBlue}Generating sample posts (${generateData.posts.length})${cReset}`)
	for (let i = 0; i < generateData.posts.length; i += 1) {
		post = generateData.posts[i]
		console.log(`==> ${cFgYellow}Post #${i+1}${cReset}`)
		await runCmd(`${wpcli} post create \
			--post_type=post \
			--post_status=publish \
			--post_title="${post.title}" \
			--post_content="${post.body}"`)
	}
	
	console.log(`==> ${cFgBlue}Generating sample comments${cReset}`)
	let j = 4; // post id
	for (let i = 0; i < generateData.posts.length; i += 1) {
		post = generateData.posts[i]
		console.log(`==> ${cFgYellow}Comment ${i+1} on Post ${j}${cReset}`)
		await runCmd(`${wpcli} comment create \
			--comment_post_ID=${j} \
			--comment_content="${post.body}" \
			--comment_author="Sample"`)
		if ((i+1) % 3 === 0) { j += 1 } // move to next post after X comments in each post
	}
}

main()
