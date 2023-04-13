import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { DBClaim } from './claim'
import { DBVerificationRequest } from './verification-request'


@Entity('encrypted_claim_proofs')
export class DBEncryptedClaimProof {

    @PrimaryGeneratedColumn({ type:'int' })
    	proofId: number
	@Index()
	@Column({ type: 'int' })
		id: number
    @Column({ type:'bytea' })
    	enc: Buffer

	@Index()
    @Column({ type:'uuid' })
    	requestId: string

    @ManyToOne(() => DBVerificationRequest, (req) => req.encryptedClaimProofs, { onDelete:'CASCADE' })
    @JoinColumn({
    	name: 'request_id',
    	referencedColumnName: 'id',
    	foreignKeyConstraintName: 'proof-request-fk'
    })
    	request: DBVerificationRequest
	@ManyToOne(() => DBClaim, (claim) => claim.proofs, { onDelete:'CASCADE' })
	@JoinColumn({
		name: 'id',
		referencedColumnName: 'id',
		foreignKeyConstraintName: 'proof-claim-fk'
	})
		claim: DBClaim
}