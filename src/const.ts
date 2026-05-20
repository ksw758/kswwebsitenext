// Career and Portfolio data now handled directly in their respective components with i18n

export const theme = {
  color: {
    gold: '#C8A84B',
    goldFaded: 'rgba(200, 168, 75, 0.75)',
    parchment: '#F7F0DC',
    sepia: '#1C0F00',
    heroBg: 'rgba(10, 6, 1, 0.72)',
  },
  font: {
    serif: "Georgia, 'Palatino Linotype', serif",
  },
} as const;

export const MySkills: {
  editor: {
    [key: string]: {
      url: string;
    },
  },
  versionControl: {
    [key: string]: {
      url: string;
    },
  },
  restapi: {
    [key: string]: {
      url: string;
    },
  },
  language: {
    [key: string]: {
      url: string;
    },
  },
  react: {
    [key: string]: {
      url: string;
    },
  },
  nodejs: {
    [key: string]: {
      url: string;
    },
  },
  databases: {
    [key: string]: {
      url: string;
    },
  },
} = {
  editor: {
    webstorm: {
      url: "https://www.jetbrains.com/webstorm/"
    }
  },
  versionControl: {
    git: {
      url: "https://git-scm.com"
    }
  },
  restapi: {
    postman: {
      url: "https://www.postman.com"
    },
    oauth: {
      url: "https://oauth.net/2"
    }
  },
  language: {
    typescript: {
      url: "https://www.typescriptlang.org"
    }
  },
  react: {
    recoil: {
      url: "https://recoiljs.org"
    },
    immer: {
      url: "https://github.com/immerjs/immer"
    },
    "react-router-dom": {
      url: "https://reactrouter.com/en/main"
    },
    highchart: {
      url: "https://www.highcharts.com"
    },
    webpack: {
      url: "https://webpack.kr/"
    },
    react_native : {
      url: "https://reactnative.dev"
    },
    tailwind_css : {
      url: "https://tailwindcss.com/"
    },
  },
  nodejs: {
    express: {
      url: "https://expressjs.com/"
    },
    sequelize: {
      url: "https://sequelize.org/"
    },
    prisma : {
      url: "https://www.prisma.io/"
    },
    multer: {
      url: "https://github.com/expressjs/multer#readme"
    },
    awsS3: {
      url: "https://github.com/aws/aws-sdk-js-v3/tree/main/clients/client-s3"
    },
    passport: {
      url: "https://www.passportjs.org/"
    },
    greenlock: {
      url: "https://git.rootprojects.org/root/greenlock.js.git"
    },
    nodemailer: {
      url: "https://nodemailer.com/about/"
    },
    nest_js: {
      url: "https://nestjs.com/"
    },
  },
  databases: {
    mysql: {
      url: "https://www.mysql.com/"
    },
    mongodb: {
      url: "https://www.mongodb.com/"
    },
    postgre_sql: {
      url: "https://www.postgresql.org/"
    },
  }
};
