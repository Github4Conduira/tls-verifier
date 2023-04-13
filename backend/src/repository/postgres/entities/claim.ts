import {
	BeforeInsert,
	Column,
	Entity,
	Index,
	JoinColumn,
	ManyToOne, OneToMany,
	PrimaryColumn
} from 'typeorm'
import { unixTimestampSeconds } from '../../../utils/generics'
import { DBLink } from './link'
import { DBEncryptedClaimProof } from './proof'

@Entity('claims')
export class DBClaim {
    @PrimaryColumn({ type:'int' })
    	id: number

    @Column({ type: 'int' })
    	chainId: number

    @Column({ type: 'text' })
    	provider: string

    @Column({ type: 'text' })
    	redactedParameters: string

    @Column({ type: 'bytea' })
    	ownerPublicKey: Buffer

	@Column({ type: 'int' })
    	timestampS: number

	@Column({ type:'text', array: true })
		witnessAddresses: string[]
	@Index()
	@Column({ type:'uuid' })
		linkId: string

    @ManyToOne(() => DBLink, (link) => link.claims, { onDelete:'CASCADE' })
    @JoinColumn({
    	name: 'link_id',
    	referencedColumnName: 'id',
    	foreignKeyConstraintName: 'claim-link-id-fk'

    })
    	link: DBLink

	@OneToMany(() => DBEncryptedClaimProof, (proof) => proof.claim, { cascade:true })
		proofs: DBEncryptedClaimProof[]

	@BeforeInsert()
	public setUpdatedAt() {
    	this.timestampS = unixTimestampSeconds()
	}
}
