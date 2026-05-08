angular.module('intercertApp', [])
  .directive('fileModel', function () {
    return {
      scope: { fileModel: '=' },
      link: function (scope, element) {
        element.bind('change', function () {
          scope.$apply(function () {
            scope.fileModel = element[0].files[0];
          });
        });
      }
    };
  })
  .controller('MainController', function ($http) {
    var vm = this;
    var config = window.APP_CONFIG || {};
    vm.authApi = config.AUTH_API_URL;
    vm.userApi = config.USER_API_URL;
    vm.token = localStorage.getItem('token');
    vm.registerForm = {};
    vm.loginForm = {};
    vm.passwordForm = {};
    vm.profile = {};
    vm.dashboard = {};

    function headers() {
      return { Authorization: 'Bearer ' + vm.token };
    }

    function showSuccess(message) {
      vm.success = message;
      vm.error = '';
    }

    function showError(error) {
      vm.success = '';
      vm.error = error.data && error.data.message ? error.data.message : 'Something went wrong';
    }

    vm.register = function () {
      $http.post(vm.authApi + '/auth/register', vm.registerForm)
        .then(function () {
          showSuccess('Registration complete. Please login.');
          vm.registerForm = {};
        })
        .catch(showError);
    };

    vm.login = function () {
      $http.post(vm.authApi + '/auth/login', vm.loginForm)
        .then(function (response) {
          vm.token = response.data.token;
          localStorage.setItem('token', vm.token);
          showSuccess('Login successful');
          vm.loadProfile();
          vm.loadDashboard();
        })
        .catch(showError);
    };

    vm.logout = function () {
      $http.post(vm.authApi + '/auth/logout', {}, { headers: headers() }).finally(function () {
        localStorage.removeItem('token');
        vm.token = '';
        vm.profile = {};
        vm.dashboard = {};
        showSuccess('Logged out');
      });
    };

    vm.loadProfile = function () {
      if (!vm.token) return;
      $http.get(vm.userApi + '/profile', { headers: headers() })
        .then(function (response) { vm.profile = response.data; })
        .catch(showError);
    };

    vm.updateProfile = function () {
      $http.put(vm.userApi + '/profile', vm.profile, { headers: headers() })
        .then(function (response) {
          vm.profile = response.data;
          showSuccess('Profile updated');
          vm.loadDashboard();
        })
        .catch(showError);
    };

    vm.uploadPhoto = function () {
      var data = new FormData();
      data.append('photo', vm.photo);
      $http.post(vm.userApi + '/profile/photo', data, {
        headers: angular.extend(headers(), { 'Content-Type': undefined }),
        transformRequest: angular.identity
      }).then(function (response) {
        vm.profile = response.data;
        showSuccess('Photo uploaded');
      }).catch(showError);
    };

    vm.changePassword = function () {
      $http.post(vm.userApi + '/password/change', vm.passwordForm, { headers: headers() })
        .then(function () {
          vm.passwordForm = {};
          showSuccess('Password changed');
        })
        .catch(showError);
    };

    vm.loadDashboard = function () {
      if (!vm.token) return;
      $http.get(vm.userApi + '/dashboard', { headers: headers() })
        .then(function (response) { vm.dashboard = response.data; })
        .catch(showError);
    };

    vm.loadProfile();
    vm.loadDashboard();
  });
