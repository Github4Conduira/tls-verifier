import {
	BeforeInsert, BeforeUpdate,
	Column,
	Entity, Index,
	JoinColumn,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn
} from 'typeorm'
import { unixTimestampSeconds } from '../../../utils/generics'
import { DBLink } from './link'
import { DBEncryptedClaimProof } from './proof'
import { DBUser } from './user'


@Entity('verification_requests')
export class DBVerificationRequest {

    @PrimaryGeneratedColumn('uuid')
    	id: string

	@Index()
    @Column({ type: 'uuid' })
    	linkId: string

	@Column({ type: 'text' })
		context: string

	@Column({ type: 'int' })
		status: number

	@Column({ type:'bytea' })
		communicationPublicKey: Buffer

	@Column({ type:'bytea' })
		communicationSignature: Buffer

	@Index()
    @Column({ type: 'text' })
    	requestorId: string

	@Index()
	@Column({ type: 'int' })
    	createdAtS: number

	@Column({ type: 'int', nullable:true })
    	updatedAtS: number

	@Index()
    @Column({ type: 'int' })
    	expiresAtS: number

	@OneToMany(() => DBEncryptedClaimProof, (proof) => proof.request, { cascade:true })
		encryptedClaimProofs: DBEncryptedClaimProof[]

    @ManyToOne(() => DBUser, (user) => user.verificationRequests, { onDelete:'CASCADE' })
    @JoinColumn({
    	name: 'requestor_id',
    	referencedColumnName: 'id',
    	foreignKeyConstraintName: 'verification-user-fk'
    })
    	requestor: DBUser

    @ManyToOne(() => DBLink, { onDelete:'CASCADE' })
    @JoinColumn({
    	name: 'link_id',
    	referencedColumnName: 'id',
    	foreignKeyConstraintName: 'verification-link-fk'
    })
    	link: DBLink
	@BeforeUpdate()
    public setUpdatedAt() {
    	this.updatedAtS = unixTimestampSeconds()
    }
	@BeforeInsert()
	public setCreatedAt() {
		this.createdAtS = unixTimestampSeconds()
	}
}
