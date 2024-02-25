import pino from 'pino';

const transport = pino.transport({
  targets: [
    {
      level: 'info',
      target: 'pino-pretty',
      options: {
        destination: `./log/${new Date().toLocaleDateString("de-DE")}.log`,
        colorize: false
      },
    },
    {
      level: 'info',
      target: 'pino-pretty',
      options: {},
    },
  ],
});

const logger = pino({level: 'info'}, transport);

export default logger