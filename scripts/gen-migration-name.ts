import chalk from 'chalk';
import clipboardy from 'clipboardy';

function generateName() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0'); // Adding 1 to month since it's zero-based
  const date = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  return `${year}${month}${date}${hours}${minutes}${seconds}_`;
}

const name = generateName();

clipboardy.writeSync(name);
console.log(chalk.blue(`Migration name ${name} copied to clipboard!`));
