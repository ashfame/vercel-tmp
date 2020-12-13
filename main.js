var debug = true;

const BackendAPI = 'https://httpscop.com/api/v1';
// const BackendAPI = 'http://httpscop.lo/api/v1';
const NotFoundView = { template: '<p>404 yo</p>' };

myHeader = Vue.component('app-header', {
	data: function () {
		return {
			title: "https cop app"
		}
	},
	template: '#header-template'
});

myFooter = Vue.component('app-footer', {
	data: function () {
		return {
			year: 2020
		}
	},
	template: '#footer-template'
});

LoginView = Vue.component('login', {
	data: function () {
		return {
			// UI state
			loggingInScreen: false,
			// Data
			u: '',
			p: ''
		}
	},
	template: '#login-template',
	methods: {
		authenticate: function (e) {
			if (this.loggingInScreen) {
				return
			}

			this.loggingInScreen = true;

			var url = BackendAPI + '/session';
			axios.post(url, {
				u: this.u,
				p: this.p
			}, {
				withCredentials: true
			}).then(response => {
				if (debug) {
					console.log(response)
				}
				this.$emit('csrf-token', response.data.csrf)
			}).catch(error => {
				alert(error.message)
			}).finally(nada => {
				this.loggingInScreen = false;
			});

			e.preventDefault();
		}
	}
});

DashboardView = Vue.component('dashboard', {
	data: function () {
		return {
			authToken: '',
			// UI state
			initializingScreen: true,
			// Data
			websites: null,
			// Add Website
			intentAddWebsite: false,
			addWebsiteFormUrl: '',
			// Search Website
			searchWebsite: '',
		}
	},
	template: '#dashboard-template',
	mounted() {
		console.log('mounted - dashboard')
		// this.load();
	},
	beforeMount() {
		// set auth header
		//  axios.defaults.headers = {
		//     'X-Unlock': this.getUnlock()
		// }

		console.log('before mount - dashboard')
		// ensure this is loaded
		this.load();
	},
	methods: {
		load: function () {
			var url = BackendAPI + '/websites';

			axios.get(url).then(response => {
				this.websites = response.data.data
			}).catch(error => {
				if (error.response.status == 401) {
					alert('redirecting to login')
					router.push('/login')
				}
				console.error(error.response.data.data.message)
			}).finally(nada => {
				this.initializingScreen = false;
			});
		},
		hasValidSession: function () {

		},
		login: function () {
			// @TODO pass on username/email & password to backend for auth
			// @TODO store token post successful auth for validating further requests
		},
		logout: function () {
			// @TODO instruct backend to clear auth token
			// @TODO clear token on client side
		},
		addWebsiteIntent: function () {
			this.intentAddWebsite = !this.intentAddWebsite;
		},
		addWebsite: function () {
			var url = BackendAPI + 'websites';
			axios.post(url, {
				domain: this.addWebsiteFormUrl,
				email_alerts: 'dev@github.com'
			}).then(response => {
				console.log(response.data.data);
			}).catch(error => {
				console.log(error)
				alert(error.message)
			}).finally(nada => {
				this.intentAddWebsite = false;
				this.load();
			});
		}
	}
});


const routes = [
	{ path: '/', component: DashboardView },
	{ path: '/login', component: LoginView }
];

const router = new VueRouter({
	routes // short for `routes: routes`
});

var app = new Vue({
	router,
	el: '#app',
	data: {
		'csrfp': ''
	},
	methods: {
		'save-csrf-token': function () {

		}
	}
});