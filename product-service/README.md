# Serverless - AWS Node.js Typescript

## Installation/deployment instructions

### Using NPM

- Run `npm i` to install the project dependencies
- Run `npx sls deploy` to deploy this stack to AWS

### Using Yarn

- Run `yarn` to install the project dependencies
- Run `yarn sls deploy` to deploy this stack to AWS

### Project structure

The project code base is mainly located within the `src` folder. This folder is divided in:

- `functions` - containing code base and configuration for lambda functions
- `libs` - containing shared code base between lambdas
- `types` - containing TypeScript types used by lambdas

```
.
├── src
│   ├── functions               # Lambda configuration and source code folder
│   │   ├── foo
│   │   │   ├── handler.ts      # `Foo` lambda source code
│   │   │   ├── index.ts        # `Foo` lambda Serverless configuration
│   │   │
│   │   └── index.ts            # Import/export of all lambda configurations
│   │
│   └── libs                    # Lambda shared code
│       └── apiGateway.ts       # API Gateway specific helpers
│       └── handlerResolver.ts  # Sharable library for resolving lambda handlers
│       └── lambda.ts           # Lambda middleware
│
│   └── types                    # Lambda TS types
│
├── package.json
├── serverless.ts               # Serverless service file
├── tsconfig.json               # Typescript compiler configuration
├── tsconfig.paths.json         # Typescript paths
```
