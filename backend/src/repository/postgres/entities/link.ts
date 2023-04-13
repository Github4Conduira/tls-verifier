import {
	BeforeInsert,
	Column,
	Entity, Index,
	JoinColumn,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn
} from 'typeorm'
import { unixTimestampSeconds } from '../../../utils/generics'
import { DBClaim } from './claim'
import { DBUser } from './user'
import { DBVerificationRequest } from './verification-request'

@Entity('links')
export class DBLink {
    @PrimaryGeneratedColumn('uuid')
    	id: string

	@Index()
	@Column({ type: 'text' })
		userId: string

    @Column({ type: 'text' })
    	name: string

	@Index()
	@Column({ type: 'int' })
    	createdAtS: number

    @Column({ type: 'int', default:0 })
    	views: number

	@ManyToOne(() => DBUser, (user) => user.links, { onDelete:'CASCADE' })
	@JoinColumn({
		name: 'user_id',
		referencedColumnName: 'id',
		foreignKeyConstraintName: 'link-user-id-fk'
	})
		user: DBUser

	@OneToMany(() => DBClaim, (claim) => claim.link, { cascade:true })
		claims: DBClaim[]

	@OneToMany(() => DBVerificationRequest, (req) => req.link, { cascade:true })
		verificationRequests: DBVerificationRequest[]

	@BeforeInsert()
	public setCreatedAt() {
		this.createdAtS = unixTimestampSeconds()
	}
}
