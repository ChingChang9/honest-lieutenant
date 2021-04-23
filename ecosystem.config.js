module.exports = {
	apps: [{
		name: "Honest Lieutenant",
		script: "index.js",
		watch: false,
		wait_ready: true,
		listen_timeout: 10000,
		shutdown_with_message: true,
		exp_backoff_restart_delay: 100
	}]
};