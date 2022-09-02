
;; DAS@STX
;; The first Decentralized Autonomous Space (DAS) on Stacks
;; It is simultaneously an exchange which is selling the DAS Token
;; This token can be used to enter the space

;; constants
;; Fees will be only applied if DAS Tokens are bought
(define-constant fee-basis-points u50) ;; 0.5%

;; Errors
(define-constant ERR-NOT-AUTHORIZED (err u401))

(define-constant ERR-ZERO-STX (err u100))
(define-constant ERR-ZERO-TOKENS (err u101))
(define-constant ERR-ALREADY-MINTED (err u102))
(define-constant NOT-PAID-ENOUGH (err u103))
(define-constant ERR-NOT-MULTIPLIER (err u104))

(define-constant ERR-NOT-OPERATIONAL (err u200))
(define-constant ERR-OCCUPIED (err u201))
(define-constant ERR-NOT-USER (err u202))
(define-constant ERR-DAS-NOT-ENOUGH-TOKENS (err u203))
(define-constant ERR-DAS-NOT-ENOUGH-STX (err u204))
(define-constant ERR-NOT-GETTING-DAS-TOKEN-BALANCE (err u205))

;; Safety Stuff
(define-data-var guardian principal tx-sender)
(define-data-var operational bool false)
(define-data-var minted bool false)

;; Usage Variables
;; stx-amount 100'000 = 0.1 STX
(define-data-var price uint u100000) ;; 1 DAS has 0 decimals
(define-data-var occupied bool false)
(define-data-var current-user (optional principal) none)

;; Logging Variables
(define-data-var counterUsers uint u0)
(define-data-var counterDuration uint u0)

(define-map das-users
  { address: principal }
  {
    address: principal,
    minutesSum: uint
  }
)

(define-data-var index-session uint u1)

(define-map das-usage-sessions uint
  {
    user: principal,
    minutes: uint
  }
)

;; private functions
;;

;; Public Functions

;; Read-Only Functions

(define-read-only (get-guardian-address)
  (ok (var-get guardian))
)

(define-read-only (get-operational)
  (ok (var-get operational))
)

(define-read-only (get-minted)
  (ok (var-get minted))
)

(define-read-only (get-price)
  (ok (var-get price))
)

(define-read-only (get-occupied)
  (ok (var-get occupied))
)

(define-read-only (get-current-user)
  (ok (var-get current-user))
)

(define-read-only (get-das-balance (who principal))
    (as-contract (contract-call? .das-token get-balance who))
)

(define-read-only (get-stx-balance (who principal))
    (ok (stx-get-balance who))
)

;; Get STX Balance of the DAO / DAS
(define-read-only (get-stx-dao-balance)
    (ok (as-contract (stx-get-balance tx-sender)))
)

;; Get DAS Token Balance of the DAO / DAS
(define-read-only (get-das-dao-balance)
    (as-contract (contract-call? .das-token get-balance tx-sender))
)

;; Logging Functions

(define-read-only (get-specific-das-user (address principal)) 
  (ok (map-get? das-users (tuple (address address))))
)

(define-read-only (get-specific-das-usage (id uint)) 
  (ok (map-get? das-usage-sessions id))
)

(define-read-only (get-last-das-usage) 
  (get-specific-das-usage (- (var-get index-session) u1))
)

(define-read-only (get-logging-data) 
  (ok {counterUsers: (var-get counterUsers), counterDuration: (var-get counterDuration)})
)

;; Safety Stuff Functions

(define-public (set-guardian-address (address principal))
  (begin
    (asserts! (is-eq tx-sender (var-get guardian)) ERR-NOT-AUTHORIZED)
    ;; #[allow(unchecked_data)]
    (ok (var-set guardian address))
  )
)

(define-public (toggle-emergency-shutdown)
  (begin
    (asserts! (is-eq tx-sender (var-get guardian)) ERR-NOT-AUTHORIZED)
    (ok (var-set operational (not (var-get operational))))
  )
)

(define-public (toggle-emergency-occupied)
  (begin
    (asserts! (is-eq tx-sender (var-get guardian)) ERR-NOT-AUTHORIZED)
    (var-set occupied false)
    (ok (var-set current-user none))
  )
)

;; Safety Stuff Functions

;; Set price stx-amount 1'000'000 = 1 STX
(define-public (set-price (newPrice uint))
  (begin
    (asserts! (is-eq tx-sender (var-get guardian)) ERR-NOT-AUTHORIZED)
    ;; #[allow(unchecked_data)]
    (ok (var-set price newPrice))
  )
)

;; Usability Stuff Functions

(define-public (mint-das-token)
  (begin
    (asserts! (is-eq tx-sender (var-get guardian)) ERR-NOT-AUTHORIZED)
    (asserts! (is-eq (var-get minted) false) ERR-ALREADY-MINTED)
    (try! (as-contract (contract-call? .das-token mint)))
    (ok (var-set minted true))
  )
)

;; Allow users to exchange STX and receive tokens using a fixed price
;; stx-amount 1'000'000 = 1 STX
(define-public (stx-to-token-swap (stx-amount uint))
  (begin 
    (asserts! (> stx-amount u0) ERR-ZERO-STX)
    ;; Check that stx-amount is a multiplier of the price
    ;; That is because DAS-Token has NO Decimals
    (asserts! (is-eq (mod stx-amount (var-get price)) u0) ERR-NOT-MULTIPLIER)
    
    (let (
      (token-amount (/ stx-amount (var-get price)))
      (user-address tx-sender)
      (contract-address (as-contract tx-sender))
      ;; charge the fee. Fee is in basis points (1 = 0.01%), so divide by 10,000
      (fee (/ (* stx-amount fee-basis-points) u10000))
      (new-stx-balance (+ stx-amount fee))
      (dasTokenBalance (unwrap! (get-das-dao-balance) ERR-NOT-GETTING-DAS-TOKEN-BALANCE))
    )
      (begin
        (asserts! (< token-amount dasTokenBalance) ERR-DAS-NOT-ENOUGH-TOKENS)
        ;; transfer STX from user to das-contract
        (try! (stx-transfer? new-stx-balance user-address contract-address))
        ;; transfer DAS tokens from das-contract to user
        (as-contract (contract-call? .das-token transfer token-amount contract-address user-address none))
      )
    )
  )
)

;; Allow users to exchange tokens and receive STX
(define-public (token-to-stx-swap (token-amount uint))
  (begin 
    (asserts! (> token-amount u0) ERR-ZERO-TOKENS)
    
    (let (
      (stx-amount (* token-amount (var-get price)))
      (user-address tx-sender)
      (contract-address (as-contract tx-sender))
    )
      (begin
        ;; Check if DAS has enough STX
        (asserts! (< stx-amount (stx-get-balance (as-contract tx-sender))) ERR-DAS-NOT-ENOUGH-STX)
        ;; transfer STX from das-contract to user
        (try! (as-contract (stx-transfer? stx-amount contract-address user-address)))
        ;; transfer DAS tokens from user to das-contract
        (contract-call? .das-token transfer token-amount user-address contract-address none)
      )
    )
  )  
)

;; Function for accessing the DAS 
(define-public (accessing-DAS (amount uint))
  (let (
    (current-das-users (map-get? das-users { address: tx-sender }))
  )
  
    (begin
      (asserts! (is-eq true (var-get operational)) ERR-NOT-OPERATIONAL)
      (asserts! (is-eq false (var-get occupied)) ERR-OCCUPIED)
      (asserts! (>= amount u1) NOT-PAID-ENOUGH)

      (if (is-some current-das-users)
        (map-insert das-users { address: tx-sender } { address: tx-sender, minutesSum: (+ (default-to u0 (get minutesSum (map-get? das-users (tuple (address tx-sender))))) amount )})
        (begin
          (map-set das-users { address: tx-sender } { address: tx-sender, minutesSum: amount })
          (var-set counterUsers (+ (var-get counterUsers) u1 ))
        )
      )

      (var-set occupied true)
      (var-set current-user (some tx-sender))

      ;; Logging stuff

      (var-set counterDuration (+ (var-get counterDuration) amount ))

      (map-insert das-usage-sessions (var-get index-session) { user: tx-sender, minutes: amount})
      (var-set index-session (+ (var-get index-session) u1 ))
      
      (let (
        (user-address tx-sender)
        (contract-address (as-contract tx-sender))
      )
        (begin
        ;; send DAS-Token from contract-caller to contract
        (contract-call? .das-token transfer amount user-address contract-address none)
        )
      )
    )
  )
)

(define-public (exiting-DAS)
 (begin
    (asserts! (is-eq (some tx-sender) (var-get current-user)) ERR-NOT-USER)
    (var-set current-user none)
    (ok (var-set occupied false))
 )
)

(begin
  (mint-das-token)
)
