# Trade Republic challenge

You find the original README.md as `./OG_README.md`.

# Notes on the solution

 - Since the opportunity is for a fullstack position, I decided to focus not only
 on the frontend but backend and infrastructure as well using AWS, Docker, and terraform.
 I wanted to show that I am familiar with the tools for deployment and infrastructure as code.
 (disclaimer) I'm not an expert in infrastructure, but I have some experience with it.
 for a real project, I would suggest using a managed service like Vercel or Netlify, which allows to focus more on the code and less on the infrastructure and provides a simpler setup for CI/CD, Test environment and deployment. 
 See the `infra/README.md` for more details.

 - For the frontend I used Preact + TS, insteaa of Vue, because I'm more familiar with it and is a lightweight alternative to React with a nice Vite integration.  For a real project, I would use some of the metaframeworks lile Next.js or Nuxt.js with a more complete setup and SSR, but for this challenge, I think it's an overkill so I made a simple SPA. 
 See the `app/README.md` for more details.

 - For e2e tests I used Playwright, because it gives me a good DX and is a good alternative to Cypress. It allows us to do some sort of TDD approach using the user stories as a guide.
 Check `./app/e2e/managing-isin.pw.ts` to see what I mean.

 - I choosed to use Docker for local development because since the FE depends on the BE, it's easier to manage them using docker-compose and makes the development environment more consistent and reproduceable. Also it alloe us to generate images during CI/CD that can be pushed to a registry and used to
 deploy the application.

 - (suggestion) The UI for mobile looks good even in wider screens, but I didn't have time to make it responsive for large screens, mostly because I didn't know how to present this data in a nice way, suggestion provide an design to base the implemetation.

 - I deployed a version of the app to http://tradewishes.cristianoliveira.com if I had more time I'd setup a tls certificate for https and a domain.

## Answer to the proposed questions

> 1. What happens in case the WebSocket disconnects? How would you go further to keep
> the live data available or inform the user? Please discuss the challenges.

There are some strategies to handle the WebSocket disconnection, some of them are:

 - Reconnect: Try to reconnect to the WebSocket server when the connection is lost, but this should be done with caution to avoid a high number of requests to the server trying to reconnect. So its better to use some sort of backoff strategy and max retries.

 - Notify the user: Show a message to the user informing that the data is not up to date and allow the user to refresh the data or try to reconnect manually. Here too we should be careful because many users trying to refresh the page at the same time can cause a high load on the server, better provide a button to refresh the data and put a random delay on the refresh so the server can handle the load.

> 2. What happens if a user adds an instrument multiple times to their list? Please discuss possible challenges and mitigations.

In terms of UX, IMO, it's better if the app doesn't allow the user to add the same instrument multiple times and show a message to the user with the error and further instructions for debugging. Unless there are usecases for that, but them I don't have enough product context to make a decision.

> 3. What potential performance issues might you face when this app scales with multiple subscriptions?
> How would you improve the speed and user experience?

On the FE

 - One of the performance issue is the rendering of the list of subscriptions, if the list grows too much, the rendering can be slow, so it's better to use 
 some sort of lazy loading or virtualization to render only the items that are visible to the user.
 - Tracking more itens means more memory usage, so managing state has to be optimized.

On the BE

 - WebSocket disconnections and reconnections attemp may burden the server, so it's better to use some sort of backoff strategy and max retries.
 - Scaling WebSockets isn't just about adding more servers; it requires specific architectural and infrastructure adjustments due to challenges like:
   - Per-connection memory overhead,
   - File descriptor limits
   - CPU usage
   - Network bandwidth consumption.
 - To manage many (millions) of WebSocket connections, an approach is to distribute connections across multiple servers by using a message broker (like RabbitMQ, Kafka, or NATS) to handle message routing and load distribution. 

 ```mermaid
 graph TD
    Client <--> LoadBalancer
    LoadBalancer -- Connection (per region) --> Server1
    LoadBalancer -- Connection (per region) --> Server2
    LoadBalancer -- Connection (per region) --> Server3
    Server1 <-- "Subscribe to" --> Message_Broker
    Server2 <-- "Subscribe to" --> Message_Broker
    Server3 <-- "Subscribe to" --> Message_Broker

    subgraph Client Side
        Client
    end

    subgraph Load Balancer
        LoadBalancer
    end

    subgraph Server Side
        Server1
        Server2
        Server3
        Message_Broker
    end

```

# Getting Started

## Prerequisites

### For local development

 - [Docker and docker-compose](https://docs.docker.com/guides/getting-started/)
 - [Node.js](https://nodejs.org/en/download/) (version 20)

### For infrastructure

 - [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html)
 - [Terraform](https://learn.hashicorp.com/tutorials/terraform/install-cli)

## Running 
 
### Local development

```bash
make docker-run
```

Once the containers are up, you can access the app at `http://localhost:7878`

### Infrastructure

Assuming you have the AWS CLI configured and the terraform installed, and an
account in Terraform Cloud, you can run the following commands:

```bash
make terraform-login
make terraform-init
make terraform-apply
```

### Others

```bash
make help # To see all available commands
```
