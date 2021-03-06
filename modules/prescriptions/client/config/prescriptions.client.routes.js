(function () {
  'use strict';

  angular
    .module('prescriptions')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('prescriptions', {
        abstract: true,
        url: '/prescriptions',
        template: '<ui-view/>'
      })
      .state('prescriptions.list', {
        url: '',
        templateUrl: 'modules/prescriptions/client/views/list-prescriptions.client.view.html',
        controller: 'PrescriptionsListController',
        controllerAs: 'vm',
        data: {
          roles: ['user', 'admin','chiefPharmacist','assistantPharmacist','doctor'],
          pageTitle: 'Prescriptions List'
        }
      })
      .state('prescriptions.create', {
        url: '/create',
        templateUrl: 'modules/prescriptions/client/views/form-prescription.client.view.html',
        controller: 'PrescriptionsController',
        controllerAs: 'vm',
        resolve: {
          prescriptionResolve: newPrescription
        },
        data: {
          roles: ['user', 'admin','doctor'],
          pageTitle: 'Prescriptions Create'
        }
      })
      .state('prescriptions.edit', {
        url: '/:prescriptionId/edit',
        templateUrl: 'modules/prescriptions/client/views/form-prescription.client.view.html',
        controller: 'PrescriptionsController',
        controllerAs: 'vm',
        resolve: {
          prescriptionResolve: getPrescription
        },
        data: {
          roles: ['user', 'admin','doctor'],
          pageTitle: 'Edit Prescription {{ prescriptionResolve.name }}'
        }
      })
      .state('prescriptions.dispense', {
        url: '',
        templateUrl: 'modules/prescriptions/client/views/list-prescriptions.client.view.html',
        controller: 'PrescriptionsListController',
        controllerAs: 'vm',
        data: {
          roles: ['user', 'admin','chiefPharmacist','assistantPharmacist'],
          pageTitle: 'Prescriptions List'
        }
      })
      .state('prescriptions.view', {
        url: '/:prescriptionId',
        templateUrl: 'modules/prescriptions/client/views/view-prescription.client.view.html',
        controller: 'PrescriptionsController',
        controllerAs: 'vm',
        resolve: {
          prescriptionResolve: getPrescription
        },
        data: {
          roles: ['user', 'admin','chiefPharmacist','assistantPharmacist','doctor'],
          pageTitle: 'Prescription {{ prescriptionResolve.name }}'
        }
      });
  }

  getPrescription.$inject = ['$stateParams', 'PrescriptionsService'];

  function getPrescription($stateParams, PrescriptionsService) {
    return PrescriptionsService.get({
      prescriptionId: $stateParams.prescriptionId
    }).$promise;
  }

  newPrescription.$inject = ['PrescriptionsService'];

  function newPrescription(PrescriptionsService) {
    return new PrescriptionsService();
  }
}());
