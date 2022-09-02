
;; das-token
;; <add a description here>

(impl-trait 'SP3FBR2AGK5H9QBDH3EEN6DF8EK8JY7RX8QJ5SVTE.sip-010-trait-ft-standard.sip-010-trait)

(define-fungible-token das-token u21000000)

(define-constant contract-owner .das)
(define-constant ERR-DAS-ONLY (err u500))
(define-constant ERR-NOT-TOKEN-OWNER (err u501))
(define-constant ERR-MAX-SUPPLY (err u502))
;; supply constants
(define-constant das-supply u20000000)
(define-constant guardian-supply u1000000)

;; supply wallets
(define-constant das-principal .das)
(define-constant exchange-principal .exchange)
(define-constant guardian-principal tx-sender)

(define-data-var token-uri (optional (string-utf8 256)) (some u"ipfs://QmegBfV56VVh5XjgwMi3CoshLoLHRuR5kGDJNNge368oWW"))

;; public functions
(define-public (transfer (amount uint) (sender principal) (recipient principal) (memo (optional (buff 34))))
	(begin
		(asserts! (or (is-eq tx-sender sender) (is-eq contract-caller sender)) ERR-NOT-TOKEN-OWNER)
        ;; #[allow(unchecked_data)]
		(ft-transfer? das-token amount sender recipient)
	)
)

(define-read-only (get-name)
    (ok "DAS TOKEN")
)

(define-read-only (get-symbol)
    (ok "DAS")
)

(define-read-only (get-decimals)
    (ok u0)
)

(define-read-only (get-balance (who principal))
    (ok (ft-get-balance das-token who))
)

(define-read-only (get-stx-balance (who principal))
    (ok (stx-get-balance who))
)

(define-read-only (get-total-supply)
    (ok (ft-get-supply das-token))
)

(define-read-only (get-token-uri)
    (ok (var-get token-uri))
)

(define-public (mint)
    (begin
        (asserts! (is-eq tx-sender contract-owner) ERR-DAS-ONLY)
        (try! (ft-mint? das-token das-supply das-principal))
        (try! (ft-mint? das-token guardian-supply guardian-principal))
        (ok true)
    )
)