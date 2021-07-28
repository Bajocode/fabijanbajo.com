# Maintainability in the Face of API Complexity

<br/>

### The What, Why and How of API Gateways

<br/>

![header](https://cdn-images-1.medium.com/max/1024/1*29Ro9i6PCvnid5o3ZZiKpA.jpeg)
*Photo by [Denys Nevozhai](https://unsplash.com/@dnevozhai?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/s/photos/highway-los-angeles?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)*

An API gateway is a component that routes traffic to the backend and decouples
clients from API contracts. It encapsulates a complex application architecture
by fronting it with a cohesive API interface. Beyond encapsulation and reverse
proxying, they may also offload cross-cutting concerns from individual services,
such as authentication, rate limiting, and request logging.

<br> 

#### An Identity Crisis
Many tools for request management and processing have emerged in recent years.
As with data systems, where data-stores are used as message queues and message
queues have database-like durability guarantees, the boundaries between proxies,
meshes, and gateways are becoming blurred.

To cut through the confusion, this article assumes the following main
responsibilities per solution:

* **Service mesh.** A dedicated network infrastructure that layers onto your
services, offloading *inter-service communication functions*, such as
encryption, observability, and resilience mechanisms.
* **API gateway.** A component that provides a cohesive abstraction across the
application architecture while offloading *edge functions* on behalf of
individual services.

We’ll now look at the “why” of API Gateways and get into a code example later.

<br/>

#### Development is Maintenance
![](https://cdn-images-1.medium.com/max/1024/1*CVSThjAXg8Vx1mnpkiX_NA.jpeg)
*Photo by [Guilherme Cunha](https://unsplash.com/@guiccunha?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)*

It is well known that the majority of the cost of software is in its ongoing
maintenance. All enhancements and fixes post-delivery are considered
“maintenance work” — keeping systems operational, analyzing failures, adapting
to different platforms, fixing bugs, and repaying 
[technical
debt](https://en.wikipedia.org/wiki/Technical_debt). We should design systems that can easily adapt to changing requirements, making
maintenance mode a little less painful.

<br>
<br>

##### *"Always code as if the guy who ends up maintaining your code will be a violent psychopath who knows where you live ― John Woods"*

<br>
<br>

#### Change is Inevitable
Business priorities change, underlying platforms change, legal and regulatory
requirements change, your users change! It’s no coincidence that the majority of
design principles focus on making things “easier to change.” Whether it’s
isolating concerns between modules
([decoupling](https://en.wikipedia.org/wiki/Coupling_%28computer_programming%29)),
masking complex interactions behind simple
[façades](https://en.wikipedia.org/wiki/Facade_pattern), or simply not repeating
ourselves ([DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself)); We
should aim for evolvable systems that allow for easy future adaptations.

![](https://cdn-images-1.medium.com/max/1024/1*eLeHG0cczNplv4UmEcHMyw.jpeg)

*Photo by [Tyler Lastovich](https://unsplash.com/@lastly?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)*

<br> 
<br> 

##### *"With every critical decision, the project team commits to a version of reality that has fewer options."*

<br>
<br> 

#### API Maintenance
As organizations transition from monolithic towards more distributed or
“[shared-nothing](https://en.wikipedia.org/wiki/Shared-nothing_architecture#:~:text=A%20shared%2Dnothing%20architecture%20%28SN,to%20eliminate%20contention%20among%20nodes.&text=A%20SN%20system%20can%20scale,central%20resource%20bottlenecks%20the%20system.)”
architectures, where services are self-managed,
[cloud-managed](https://en.wikipedia.org/wiki/Mobile_backend_as_a_service), or 
“[serverless functions](https://en.wikipedia.org/wiki/Serverless_computing)”,
operational complexity increases and offering a dependable API experience
becomes challenging. This complexity slows down the project team, further
increasing the cost of maintenance.

![](https://cdn-images-1.medium.com/max/1024/1*XsHDeVWZHgNvV9Kz5912Mg.png)
*Direct client-to-service communication (diagram by [myself](https://portfolio.fabijanbajo.com/))*

In API management, direct client-to-service communication tends to increase API
complexity and can come with unintended consequences:

- **Tight coupling.** Client apps directly depend on ever-changing API contracts
of backend services.
- **Duplication of knowledge.** Each exposed service implements its own edge
functions, such as SSL termination and rate-limiting.
- **Many round trips.** An excessive number of round trips over the network due to
complex API composition flows could degrade performance.
- **An increased attack surface.** A lot more ports are now open, more services
are exposed, and authentication just became a distributed issue as well.

<br> 
<br> 

##### *"Improving maintainability does not necessarily mean reducing functionality; it can also mean reducing complexity."*

<br>
<br> 

#### A Façade for the Back-end
Properly designed abstractions can hide a great deal of implementation detail
behind simple façades. API gateways provide this abstraction by encapsulating
complex backend architectures while exposing a consistent and client-friendly
API interface.

![](https://cdn-images-1.medium.com/max/1024/1*17EbCAaySFw_PR907Si9UA.png)
*Communication through an API gateway (diagram by [myself](https://portfolio.fabijanbajo.com))*

To keep the API complexity of (distributed) systems at a manageable level, API
gateways help by:

- **Decoupling clients from backend contracts.** API routes are managed through a
separate request routing configuration, keeping the client interface consistent.
- **Consolidating cross-cutting concerns into one-tier.** Gateways reduce
duplication and simplify each service by centralizing the responsibility for
critical edge functions.
- **Aggregating data across services.** We can now apply API composition
“server-side” by dispatching a single client request to several internal
services and respond with an aggregated payload.
- **Hiding internal services from the outside world.** Exposing only the gateway
reduces the network attack surface and allows for centralized API security
management.

<br> 
<br>

## Declarative API Gateways with KrakenD
The remainder of this post demonstrates a few common tasks performed by an API
gateway through an example project.

Some of the popular (open source) API gateways available today include:

* Kong: [https://github.com/Kong/kong](https://github.com/Kong/kong)
* Tyk:
[https://github.com/TykTechnologies/tyk](https://github.com/TykTechnologies/tyk)
* KrakenD:
[https://github.com/devopsfaith/krakend-ce](https://github.com/devopsfaith/krakend-ce)

I’ve chosen KrakenD because of its:

* **Simplicity.** A [docker image](https://hub.docker.com/r/devopsfaith/krakend/)
with a single configuration file is all you need.
* **Statelessness and immutability.** Being stateless, immutable, and independent
from surrounding workloads simplifies maintenance and reduces coupling.
* **Performance. **With** **an** **additional network hop that every request will
have to go through, you want it to be fast. KrakenD is built with performance in
mind ([~18,000
requests/second](https://www.krakend.io/docs/benchmarks/overview/)).

It adheres to the majority of [twelve-factor app
practices](https://12factor.net/), an ideal candidate for container
environments.

<br> 

#### The Project
![](https://cdn-images-1.medium.com/max/2160/1*E5pu2bcuOl7LfMV-wWI9YQ.png)
*Example project process flow (diagram by [myself](https://portfolio.fabijanbajo.com/))*

The example application represents a portion of a [larger e-commerce
micro-service
project](https://github.com/Bajocode/polyglot-microservices-webshop) with an iOS
front-end I’m experimenting with. We’ll just use the following pieces:

*Application:*

* **Cart service. **A REST service written in GO that manages shopping carts for
registered customers.
* **Identity service.** A REST service written in Typescript that manages customer
accounts and issues JSON Web Tokens (JWTs).
* **Gateway**. A KrakenD (Community Edition) API gateway that handles request
routing, authorization, payload validation, and rate-limiting.

> I’ve extended the storage layer for this article to not depend on Postgres and
> Redis and keep things light.

*Infrastructure:*

* **Kubernetes, Helm & Skaffold. **All workloads are packaged through Kubernetes
Helm charts. Skaffold handles the *workflow* for building and deploying the
entire project onto your cluster.
* **Docker Compose.** Instead of Kubernetes, the project can also be built and
deployed through Docker Compose.

For simplicity, we’ll use Docker Compose while constructing our gateway manifest
in the following sections, though a fully working Kubernetes configuration is
provided in the repository.

    Project:

    .
    ├── 
    │ ├── src/
    │ ├── Dockerfile
    │ └── Makefile
    ├── 
    │ ├── src/
    │ ├── Dockerfile
    │ └── Makefile
    ├── 
    │ ├── identity-service/
    │ ├── cart-service/
    │ └── gateway/
    ├── krakend.yaml
    ├── docker-compose.yaml
    └── skaffold.yaml

    Versions:

    Kubernetes:  1.21.2
    Helm:        3.3.3
    Skaffold:    1.27.0
    Docker:      20.10.5
    Go:          1.15.2
    NodeJS:      12.19.0
    KrakenD:     1.2

> The complete source code of the example application is available on [GitHub](https://github.com/Bajocode/article-apigateways).

<br> 

#### Build and Deploy with [Docker Compose](https://docs.docker.com/compose/install/)
Install [Docker](https://docs.docker.com/get-docker/) and run:

```shell
$ docker compose up
...
[+] Running 3/3
 ⠿ Container cart-service      Started  4.0s
 ⠿ Container identity-service  Started  5.8s
 ⠿ Container gateway           Started  7.0s
```

```yaml
# docker-compose.yaml
---
version: "3.7"
services:

  gateway:
    image: devopsfaith/krakend:1.2
    container_name: gateway
    ports:
    - 8080:8080
    volumes:
    - ./krakend.yaml:/etc/krakend/krakend.yaml
    entrypoint: [ "/usr/bin/krakend" ]
    command: [ "run", "--debug", "--config", "/etc/krakend/krakend.yaml", "--port", "8080" ]

  identity-service:
    build:
      context: ./identity-service
    ports:
    - 9005
    environment:
    - SERVER_HOST=0.0.0.0
    - SERVER_PORT=9005
    - LOGGER_LEVEL=debug
    - SERVER_READ_TIMEOUT=5000
    - SERVER_IDLE_TIMEOUT=15000
    - JWT_VALIDATION_ENABLED=true # disable if krakend handles auth!
    - JWT_PATHS_WHITELIST=/auth/register,/auth/login,/jwks.json
    - JWT_SECRET=secret
    - JWT_EXP_SECS=86400
    - JWT_ALGO=HS256

  cart-service:
    build:
      context: ./cart-service
    ports:
    - 9002
    environment:
    - APP_ENV=dev
    - SERVER_HOST=0.0.0.0
    - SERVER_PORT=9002
    - LOCAL_STORE_ENABLED=true
    - LOGGER_LEVEL=debug
    - SERVER_READ_TIMEOUT=5s
    - SERVER_WRTIE_TIMEOUT=10s
    - SERVER_IDLE_TIMEOUT=15s
```
*Docker-compose configuration for building and running the containers*

<br> 

#### Build and Deploy with Kubernetes, Helm and Skaffold
Create a Kubernetes cluster locally or in the cloud.

> Docker Desktop includes a standalone Kubernetes server and client that runs on your machine. To enable Kubernetes go to **Docker** > **Preferences** > **Kubernetes** and then click **Enable Kubernetes**.

[Install Skaffold](https://skaffold.dev/docs/install/) and
[Helm](https://helm.sh/docs/intro/install/), and deploy all helm-charts: 

```shell
$ skaffold run --port-forward=user --tail
...
Waiting for deployments to stabilize...
 - deployment/cart-service is ready.
 - deployment/gateway is ready.
 - deployment/identity-service is ready.
Deployments stabilized in 19.0525727s
```
*Skaffold configuration for building the containers and deploying them through
helm-charts*

<br> 

#### API Configuration as Code
Create a new KrakenD manifest at `project-root/krakend.yaml` with the following
contents:

```yaml
# krakend.yaml
---
version: 2
endpoints: []
```

All I’m doing here is specifying the version of the file format.

<br> 

#### Routing
Add an endpoint object under the `endpoints` array and expose the `GET /users`
identity service endpoint:

```yaml
# krakend.yaml
---
...
endpoints:

- endpoint: /users
  method: GET
  output_encoding: no-op
  backend:
  - url_pattern: /users
    encoding: no-op
    sd: static
    method: GET
    host:
    - http://identity-service:9005
```

* The `no-op` (no-operation) encoding ensures client requests are forwarded to the
backend *as is*, and vice-versa.
* `static` resolution is the default service discovery setting and is what we’ll
use for our Docker Compose network.

> For Kubernetes deployments, set `sd` to `dns` (enabling [DNS
> SRV](https://kubernetes.io/docs/concepts/services-networking/dns-pod-service/)
mode)

Restart the gateway and execute a `GET /users` request:

```shell
$ docker compose restart gateway

$ curl \
  --request GET \
  --include

"HTTP/1.1 401 Unauthorized"
...
{
  "status": 401,
  "message": "No Authorization header"
}
```

I’ve written [custom JWT authorization
middleware](https://github.com/Bajocode/article-apigateways/blob/master/identity-service/src/middleware/authMiddleware.ts)
for the identity service for decoding and validating
[JWT](https://en.wikipedia.org/wiki/JSON_Web_Token) payloads, configurable
through:

```yaml
# docker-compose.yaml
---
...
identity-service:
    environment:
    - JWT_VALIDATION_ENABLED=true
    - JWT_PATHS_WHITELIST=/auth/register,/auth/login,/jwks.json
```

Leave the above as is and extend `krakend.yaml` with `register` and `login`
routes to issue JWT tokens from the identity service:

```yaml
# krakend.yaml
---
...
endpoints:
- endpoint: /users
  ...
- endpoint: /auth/register
  method: POST
  output_encoding: no-op
  backend:
  - url_pattern: /auth/register
    encoding: no-op
    sd: static
    method: POST
    host:
    - http://identity-service:9005
- endpoint: /auth/login
  method: POST
  output_encoding: no-op
  backend:
  - url_pattern: /auth/login
    encoding: no-op
    sd: static
    method: POST
    host:
    - http://identity-service:9005
```

Issue a JWT token by registering a new user and export it into your shell’s
environment for later use:

```shell
$ docker compose restart gateway

$ curl \
  --request POST \
  --header "Content-type: application/json" \
  --include \
  --data '{
    "email": "som@ebo.dy",
    "password": "pass"
  }'

HTTP/1.1 201 Created
...
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InVzZX...",
  "expiry": 1623536812
}

$ export TOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InVzZX...
```

Inject your token into the`Authorization` header and try fetching all users
again:

```shell
$ curl \
    --request "GET" \
    --header "Authorization: Bearer ${TOKEN}" \
    --include

HTTP/1.1 401 Unauthorized
...
{
  "status": 401,
  "message": "No Authorization header"
}
```

KrakenD does not send client headers to the backend by default.

Add a `headers_to_pass` property under the `/users` endpoint object to forward
the `Authorization` request header to the backend:

```yaml
# krakend.yaml
---
...
endpoints:

- endpoint: /users
  ...
  headers_to_pass:
  - Authorization
  backend:
  ...
```

With the `Authorization` header forwarded, we can now retrieve all users:

```shell
$ docker compose restart gateway

curl \
    --request "GET" \
    --header "Authorization: Bearer ${TOKEN}" \
    --include

HTTP/1.1 200 OK 

[{
   "id":"f06b084b-9d67-4b01-926b-f90c6246eed9",
   "email":"
"
}]
```

Our KrakenD manifest so far:

```yaml
---
version: 2
endpoints:

- endpoint: /users
  method: GET
  output_encoding: no-op
  headers_to_pass:
  - Authorization
  backend:
  - url_pattern: /users
    encoding: no-op
    sd: static
    method: GET
    host:
    - http://identity-service:9005

- endpoint: /auth/register
  method: POST
  output_encoding: no-op
  backend:
  - url_pattern: /auth/register
    encoding: no-op
    sd: static
    method: POST
    host:
    - http://identity-service:9005

- endpoint: /auth/login
  method: POST
  output_encoding: no-op
  backend:
  - url_pattern: /auth/login
    encoding: no-op
    sd: static
    method: POST
    host:
    - http://identity-service:9005
```

<br> 

#### Offloading Authorization

Let’s not write custom GO authorization middleware for the cart service but
shield its endpoints by offloading this cross-cutting concern to the gateway.

The [JSON Web Key
Set](https://datatracker.ietf.org/doc/html/rfc7517#section-4.1) format is used
to expose our token integrity verification key(s) to the gateway. For
simplicity, I went for a symmetric signature generation with the HS256 algorithm
(HMAC-SHA256) when writing the identity service (our [identity
provider](https://en.wikipedia.org/wiki/Identity_provider)):

```shell
$ echo -n 'secret' | openssl base64
c2VjcmV0
```

🤫

Our JWKS contains the same symmetric key, statically hosted at
`identity-service/jwks.json`:

```json
{
  "keys": [
    {
      "kty": "oct",     # key type (octet string)
      "kid": "userid",  # key id (identify the key in the set)
      "k": "c2VjcmV0",  # key
      "alg": "HS256"    # algorithm
    }
  ]
}
```

> For more about the JWK standard, refer to the [RFC
> document](https://datatracker.ietf.org/doc/html/rfc7517).

Append a `PUT /cart` endpoint to the manifest and shield it from unregistered
customers through the `krakend-jose` validator plugin:

```yaml
# krakend.yaml
---
...
- endpoint: /cart
  method: PUT
  output_encoding: no-op
  extra_config:
    github.com/devopsfaith/krakend-jose/validator:
      alg: HS256
      jwk-url: 
      disable_jwk_security: true
      kid: userid
  backend:
  - url_pattern: /cart                   
    encoding: no-op
    sd: static
    method: PUT
    host:
    - http://cart-service:9002 
```

Here we specify the “key ID” and allow HTTP access to our privately hosted JWKS
by setting `disable_jwk_security` to `false`.

> If you closed your shell session, execute a `/login` request and re-export your
> token into the shell’s environment: <br> `curl ‘http://0.0.0.0:8080/auth/login' -H “Content-type: application/json” -d ‘{“email”: “som@ebo.dy”,”password”: “pass”}’`

Execute a `PUT /cart` request with a valid token to update the user’s cart:

```shell
$ docker compose restart gateway

$ curl \
  --request "PUT" \
  --header "Content-type: application/json" \
  --header "Authorization: Bearer ${TOKEN}" \
  --include \
  --data '{
    "items": [{
      "productid": "94e8d5de-2192-4419-b824-ccbe7b21fa6f",
      "quantity": 2,
      "price": 200
    }]
  }'

HTTP/1.1 400 Bad Request
...
{
  "message": "Bad request: no userID"
}
```

The cart service expects the client’s user ID to be prepended to all paths. The
user ID could manually be extracted from the JWT payload as [I embedded it
myself under the userid JWT
claim](https://github.com/Bajocode/article-apigateways/blob/master/identity-service/src/auth/AuthRepository.ts).

Fortunately, we can access validated JWT payloads through the KrakenD `JWT`
variable and pass it to the cart endpoint’s backend object:

```yaml
# krakend.yaml
---
...
- endpoint: /cart
  ...
  backend:
  - url_pattern: /{JWT.userid}/cart                   
    ...
```

If we execute the `PUT /cart` request again, it should successfully create or
update  the `cart`:

```shell
$ docker compose restart gateway

$ curl \
  --request "PUT" \
  --header "Content-type: application/json" \
  --header "Authorization: Bearer ${TOKEN}" \
  --include \
  --data '{
    "items": [{
      "productid": "94e8d5de-2192-4419-b824-ccbe7b21fa6f",
      "quantity": 2,
      "price": 200
    }]
  }'

HTTP/1.1 201 Created
...
{
  "items": [
    {
      "productid": "94e8d5de-2192-4419...",
      "quantity": 2,
      "price":200
    }
  ]
}
```

The next step would be refactoring `GET /users` to offload JWT validation from
the `identity-service` as well.

I will leave this as an exercise. Before you start though, make sure to disable
the service level JWT validation at the identity service:

```yaml
docker-compose.yaml
---
identity-service:
  ...
  - JWT_VALIDATION_ENABLED=false    # offloaded to the gateway!
  ...
```

    $ docker compose down && docker compose up

<br> 

#### Validation

The following example is purely for illustrative purposes and shows how KrakenD
can perform [schema](https://json-schema.org/)-based JSON validation. It might
be wise not to couple the gateway with business logic (unlike this example),
ensuring services stay within their boundary.

For illustrative purposes, let’s specify that the `email` and `password` fields
of the `/register` endpoint are `required` and must be of type `string`:

```yaml
# krakend.yaml
---
...
- endpoint: /auth/register
  method: POST
  output_encoding: no-op
  extra_config:
    github.com/devopsfaith/krakend-jsonschema:
      type: object
      required:
      - email
      - password
      properties:
        email:
          type: string
        password:
          type: string
  backend:
  ...
```

First, change the `email` key to send an invalid payload:

```shell
$ docker compose restart gateway

$ curl \
    --request POST \
    --header "Content-type: application/json" \
    --include \
    --data '{
      "emai": "
",
      "password": "pass"
    }'

HTTP/1.1 400 Bad Request
```

Correct your payload and verify that the request succeeds:

```shell
$ curl \
    --request POST \
    --header "Content-type: application/json" \
    --include \
    --data '{
      "email": "
2",
      "password": "pass"
    }'

HTTP/1.1 201 Created

{
  "token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InVzZXJ...",
  "expiry":1625254416
}
```

<br> 

#### Rate limiting

Lastly, we will focus on traffic management. To protect our services from
excessive use — whether intended or unintended, we can
[rate-limit](https://en.wikipedia.org/wiki/Rate_limiting) critical or unshielded
paths and establish a usage quota for our clients.

First, bombard our `/register` endpoint with 100 request and see what happens:

```shell
for i in {1..100}; do curl \
  --request POST \
  --header "Content-type: application/json" \
  --include \
  --data '{
    "email": "d
os",
    "password": "pass"
  }';
done

HTTP/1.1 201 Created
HTTP/1.1 409 Conflict
HTTP/1.1 409 Conflict
...
HTTP/1.1 409 Conflict # 100
```

Every request is being handled by the identity service, leading to excessive
processing and database communication.

Now add a limit of 5 requests per second (per IP address) and a cap of 100
request per second in total for the `/register` endpoint:

```yaml
# krakend.yaml
---
...
- endpoint: /auth/register
    ...
    github.com/devopsfaith/krakend-jsonschema:
    ...
    github.com/devopsfaith/krakend-ratelimit/juju/router:
      maxRate: 100
      clientMaxRate: 5
      strategy: ip
    ...
...
```

Notice how the gateway short-circuits all requests exceeding our quota:

```shell
$ docker compose restart gateway

for i in {1..100}; do curl \
  --request POST \
  --header "Content-type: application/json" \
  --include \
  --data '{
    "email": "d
os",
    "password": "pass"
  }';
done

HTTP/1.1 201 Created
HTTP/1.1 409 Conflict
...
HTTP/1.1 429 Too Many Requests
...
HTTP/1.1 429 Too Many Requests
```

<br> 

#### Know When to Stop

As vendors in the API market keep adding features to differentiate their
products, it’s important to know when to stop offloading responsibility to the
edge. Bloated and overambitious gateways are difficult to test and deploy.

Apart from having too many responsibilities, other possible concerns include:

- **Single point of failure.** As a single entry point for the backend layer, we
must ensure the gateway is resilient. Avoid single points of failure through
[redundancy](https://en.wikipedia.org/wiki/Redundancy_(engineering)),
[elasticity](https://en.wikipedia.org/wiki/Elasticity_(cloud_computing)) and
[failure recovery
mechanisms](https://en.wikipedia.org/wiki/Recovery-oriented_computing).
- **An additional service to maintain.** Will the effort of maintaining the
gateway incur technical debt? What does it mean for the responsibilities of the
development team?
- **An additional network hop.** The gateway can increase the response times due
to the additional network hop to the backend. Though this has less impact than
direct client-to-backend requests, it remains crucial to consistently load-test
the system, ensuring we meet our SLO’s with confidence.

<br> 

#### The Final KrakenD Manifest

```yaml
---
version: 2
endpoints:

- endpoint: /users
  method: GET
  output_encoding: no-op
  extra_config:
    github.com/devopsfaith/krakend-jose/validator:
      alg: HS256
      jwk-url: http://identity-service:9005/jwks.json
      disable_jwk_security: true
      kid: userid
  backend:
  - url_pattern: /users
    encoding: no-op
    sd: static
    method: GET
    host:
    - http://identity-service:9005

- endpoint: /auth/register
  method: POST
  output_encoding: no-op
  extra_config:
    github.com/devopsfaith/krakend-jsonschema:
      type: object
      required:
        - email
        - password
      properties:
        email:
          type: string
        password:
          type: string
    github.com/devopsfaith/krakend-ratelimit/juju/router:
      maxRate: 100
      clientMaxRate: 5
      strategy: ip
  backend:
  - url_pattern: /auth/register
    encoding: no-op
    sd: static
    method: POST
    host:
    - http://identity-service:9005

- endpoint: /auth/login
  method: POST
  output_encoding: no-op
  backend:
  - url_pattern: /auth/login
    encoding: no-op
    sd: static
    method: POST
    host:
    - http://identity-service:9005

- endpoint: /cart
  method: PUT
  output_encoding: no-op
  extra_config:
    github.com/devopsfaith/krakend-jose/validator:
      alg: HS256
      jwk-url: http://identity-service:9005/jwks.json
      disable_jwk_security: true
      kid: userid
  backend:
  - url_pattern: /{JWT.userid}/cart
    encoding: no-op
    sd: static
    method: PUT
    host:
    - http://cart-service:9002
```

#### <br> 

### Wrapping Up

API gateways provide a dependable interface for clients and a central point for
managing requests and responses. In a distributed architecture, they can be used
to offload cross-cutting functionality that would otherwise have to be
replicated. An API gateway comes with many advantages, but it also adds another
component to maintain and optimize for performance and reliability.

This article has also been posted on [medium](https://fabijan-bajo.medium.com/)
