import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryColumn } from 'typeorm'
import { unixTimestampSeconds } from '../../../utils/generics'
import { DBLink } from './link'
import { DBVerificationRequest } from './verification-request'

@Entity('users')
export class DBUser {
    @PrimaryColumn('text')
    	id: string
    @Column({ type: 'text', nullable:true })
    	firebaseToken: string

    @Column({ type: 'int' })
    	createdAtS: number

    @Column({ type: 'int', nullable:true })
    	updatedAtS: number

    @OneToMany(() => DBLink, (link) => link.user, { cascade:true })
    	links: DBLink[]

    @OneToMany(() => DBVerificationRequest, (req) => req.requestor, { cascade:true })
    	verificationRequests: DBVerificationRequest[]

    @BeforeUpdate()
    public setUpdatedAt() {
    	this.updatedAtS = unixTimestampSeconds()
    }
    @BeforeInsert()
    public setCreatedAt() {
    	this.createdAtS = this.createdAtS || unixTimestampSeconds()
    }
}
