var URL = "";

angular.module('configuration', [])
    .value('server', {
        access: {
            login: URL + 'client/auth/signin',
            check: URL + 'client/auth/checkCode',
            registration: URL + 'client/acl/auth/sign_up',
            forgot: URL + 'client/acl/auth/forgot',
            newToken:URL + 'client/auth/newToken'
        }
    })
    .value('translate', {
        'ru': {
            'index': [
                'Ошибка подключения',
                'Нет подключения к сети, опции не доступны',
                'Расчитаться бонусами?'
            ],
        }
    });