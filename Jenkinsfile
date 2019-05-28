pipeline {
    agent {
        kubernetes {
            label 'node-carbon'
        }
    }
    environment {
        npm_config_registry = 'http://nexus.molgenis-nexus:8081/repository/npm-central/'
    }
    stages {
        stage('Prepare') {
            steps {
                script {
                    env.GIT_COMMIT = sh(script: 'git rev-parse HEAD', returnStdout: true).trim()
                }
                container('vault') {
                    script {
                        env.GITHUB_TOKEN = sh(script: 'vault read -field=value secret/ops/token/github', returnStdout: true)
                        env.CODECOV_TOKEN = sh(script: 'vault read -field=value secret/ops/token/codecov', returnStdout: true)
                        env.NPM_TOKEN = sh(script: 'vault read -field=value secret/ops/token/npm', returnStdout: true)
                    }
                }
            }
        }
        stage('Install and test: [ pull request ]') {
            when {
                changeRequest()
            }
            steps {
                container('node') {
                    sh "yarn install"
                    sh "yarn unit"
                }
            }
            post {
                always {
                    container('node') {
                        sh "curl -s https://codecov.io/bash | bash -s - -c -F unit -K"
                    }
                }
            }
        }
        stage('Install, test and build: [ master ]') {
            when {
                allOf {
                    branch 'master'
                    not {
                        changelog '.*^\\[skip ci\\]$'
                    }
                }
            }
            steps {
                milestone 1
                container('node') {
                    sh "yarn install"
                    sh "yarn unit"
                }
            }
            post {
                always {
                    container('node') {
                        sh "curl -s https://codecov.io/bash | bash -s - -c -F unit -K"
                    }
                }
            }
        }
        stage('Release: [ master ]') {
            when {
                allOf {
                    branch 'master'
                    not {
                        changelog '.*\\[skip ci\\]$'
                    }
                }
            }
            steps {
                milestone 2
                container('node') {
                    sh "git config --global user.email molgenis+ci@gmail.com"
                    sh "git config --global user.name molgenis-jenkins"
                    sh "npx semantic-release"
                }
            }
        }
    }
}
