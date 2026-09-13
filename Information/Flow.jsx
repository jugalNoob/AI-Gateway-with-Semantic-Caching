I would make your project even better

Use three layers of caching:

Request
   │
   ▼
L1 Exact Cache
Redis
   │
   │ miss
   ▼
L2 Semantic Cache
Vector DB / MongoDB Vector Search
   │
   │ miss
   ▼
L3 AI Provider
   │
   ├── Provider A
   │
   └── Provider B fallback

So:

Question
   │
   ├── Exact match? ────── YES → Redis response
   │
   └── NO
        │
        ▼
   Semantic similarity?
        │
        ├── YES → cached semantic response
        │
        └── NO
             │
             ▼
        AI Provider A
             │
             ├── success → save cache
             │
             └── failure
                    │
                    ▼
              AI Provider B
                    │
                    ▼
                save cache

This is much stronger as a resume project.

:::::::::: -------------- <><><><> </></></>

                    React / Client
                          │
                          ▼
                  ┌───────────────┐
                  │  Express API  │
                  └───────┬───────┘
                          │
                          ▼
                  ┌───────────────┐
                  │ AI Controller │
                  └───────┬───────┘
                          │
                Generate embedding
                          │
                          ▼
                  ┌───────────────┐
                  │ Semantic Cache │
                  └───────┬───────┘
                          │
                ┌─────────┴─────────┐
                │                   │
             CACHE HIT          CACHE MISS
                │                   │
                ▼                   ▼
             Return          ┌──────────────┐
             response        │ AI Provider  │
                             │    #1        │
                             └──────┬───────┘
                                    │
                              failure/limit?
                                    │
                                    ▼
                             ┌──────────────┐
                             │ AI Provider  │
                             │    #2        │
                             └──────┬───────┘
                                    │
                                    ▼
                              AI response
                                    │
                    ┌───────────────┴──────────────┐
                    │                              │
                    ▼                              ▼
              Save embedding                  Save response
              in DB/cache                     in DB/cache

5 ... ::::::::::::::::::::::::::::::::::::::: 



                                  REQUEST
                       │
                       ▼
                Normalize question
                       │
                       ▼
                 Redis Cache
                 /          \
              HIT            MISS
               │                │
               ▼                ▼
          Return answer      Mongo Exact
                              /       \
                           HIT         MISS
                            │            │
                            ▼            ▼
                         Answer       Embedding
                                         │
                                         ▼
                                  Semantic Search
                                    /        \
                                  HIT        MISS
                                   │           │
                                   ▼           ▼
                                Answer       runAgent()
                                               │
                                               ▼
                                          Save Mongo
                                               │
                                               ▼
                                          Save Redis
                                               │
                                               ▼
                                            Answer