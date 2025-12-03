import { Command } from 'commander';
import inquirer from 'inquirer';
import ora from 'ora';
import { getApi, handleApiError } from '../lib/api.js';
import { setToken, setRefreshToken, setEmail, logout as doLogout, isLoggedIn, getEmail } from '../lib/config.js';
import { success, error, info, heading, printKeyValue } from '../lib/output.js';

export function registerAuthCommands(program: Command): void {
  const auth = program.command('auth').description('Authentication commands');

  // Login
  auth
    .command('login')
    .description('Login to Bunker Cloud')
    .option('-e, --email <email>', 'Email address')
    .option('-p, --password <password>', 'Password')
    .action(async (options) => {
      let { email, password } = options;

      if (!email || !password) {
        const answers = await inquirer.prompt([
          {
            type: 'input',
            name: 'email',
            message: 'Email:',
            when: !email,
            validate: (input) => (input.includes('@') ? true : 'Please enter a valid email'),
          },
          {
            type: 'password',
            name: 'password',
            message: 'Password:',
            when: !password,
            mask: '*',
          },
        ]);
        email = email || answers.email;
        password = password || answers.password;
      }

      const spinner = ora('Logging in...').start();

      try {
        const api = getApi();
        const response = await api.post('/auth/login', { email, password });

        const { accessToken, refreshToken } = response.data.data;
        setToken(accessToken);
        setRefreshToken(refreshToken);
        setEmail(email);

        spinner.stop();
        success(`Logged in as ${email}`);
      } catch (err) {
        spinner.stop();
        error(`Login failed: ${handleApiError(err)}`);
        process.exit(1);
      }
    });

  // Register
  auth
    .command('register')
    .description('Create a new Bunker Cloud account')
    .option('-e, --email <email>', 'Email address')
    .option('-p, --password <password>', 'Password')
    .option('-n, --name <name>', 'Full name')
    .action(async (options) => {
      let { email, password, name } = options;

      if (!email || !password || !name) {
        const answers = await inquirer.prompt([
          {
            type: 'input',
            name: 'name',
            message: 'Full name:',
            when: !name,
          },
          {
            type: 'input',
            name: 'email',
            message: 'Email:',
            when: !email,
            validate: (input) => (input.includes('@') ? true : 'Please enter a valid email'),
          },
          {
            type: 'password',
            name: 'password',
            message: 'Password:',
            when: !password,
            mask: '*',
            validate: (input) => (input.length >= 8 ? true : 'Password must be at least 8 characters'),
          },
          {
            type: 'password',
            name: 'confirmPassword',
            message: 'Confirm password:',
            when: !password,
            mask: '*',
            validate: (input, answers) =>
              input === answers?.password ? true : 'Passwords do not match',
          },
        ]);
        email = email || answers.email;
        password = password || answers.password;
        name = name || answers.name;
      }

      const spinner = ora('Creating account...').start();

      try {
        const api = getApi();
        await api.post('/auth/register', { email, password, name });

        spinner.text = 'Logging in...';
        const loginResponse = await api.post('/auth/login', { email, password });

        const { accessToken, refreshToken } = loginResponse.data.data;
        setToken(accessToken);
        setRefreshToken(refreshToken);
        setEmail(email);

        spinner.stop();
        success('Account created successfully!');
        success(`Logged in as ${email}`);
      } catch (err) {
        spinner.stop();
        error(`Registration failed: ${handleApiError(err)}`);
        process.exit(1);
      }
    });

  // Logout
  auth
    .command('logout')
    .description('Logout from Bunker Cloud')
    .action(() => {
      doLogout();
      success('Logged out successfully');
    });

  // Status
  auth
    .command('status')
    .description('Show current authentication status')
    .action(async () => {
      if (!isLoggedIn()) {
        info('Not logged in. Run `bunker auth login` to authenticate.');
        return;
      }

      const spinner = ora('Checking status...').start();

      try {
        const api = getApi();
        const response = await api.get('/auth/me');
        const user = response.data.data;

        spinner.stop();
        heading('Authentication Status');
        printKeyValue({
          'Logged in as': user.email,
          Name: user.name,
          'Account ID': user.id,
          'Created at': new Date(user.created_at).toLocaleDateString(),
        });
      } catch (err) {
        spinner.stop();
        const email = getEmail();
        if (email) {
          info(`Logged in as ${email} (session may have expired)`);
        } else {
          error(`Could not verify status: ${handleApiError(err)}`);
        }
      }
    });

  // Whoami (alias for status)
  auth
    .command('whoami')
    .description('Show current user')
    .action(async () => {
      if (!isLoggedIn()) {
        info('Not logged in');
        return;
      }

      try {
        const api = getApi();
        const response = await api.get('/auth/me');
        console.log(response.data.data.email);
      } catch (err) {
        const email = getEmail();
        if (email) {
          console.log(email);
        } else {
          error(handleApiError(err));
        }
      }
    });
}
