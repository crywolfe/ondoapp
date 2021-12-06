import {
  Paused as PausedEvent,
  RoleAdminChanged as RoleAdminChangedEvent,
  RoleGranted as RoleGrantedEvent,
  RoleRevoked as RoleRevokedEvent,
  Unpaused as UnpausedEvent
} from "../generated/Registry/Registry"
import {
  Paused,
  Role,
  RoleAdminChanged,
  RoleGranted,
  RoleRevoked,
  Unpaused
} from "../generated/schema"

export function handlePaused(event: PausedEvent): void {
  let entity = Paused.load(event.transaction.hash.toHex())
  if (entity === null) {
    entity = new Paused(
      event.transaction.hash.toHex() + "-" + event.logIndex.toString())
  }

  entity.account = event.params.account
  entity.save()
}

export function handleRoleAdminChanged(event: RoleAdminChangedEvent): void {
  let role = Role.load(event.transaction.hash.toHex())
  if (role === null) {
    role = new Role(event.transaction.hash.toHex())
  }
  
  let roleAdminChangedEntity = new RoleAdminChanged(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  roleAdminChangedEntity.role = event.params.role
  roleAdminChangedEntity.previousAdminRole = event.params.previousAdminRole
  roleAdminChangedEntity.newAdminRole = event.params.newAdminRole
    
  role.adminRole = roleAdminChangedEntity.role

  role.save()
  roleAdminChangedEntity.save()
}

export function handleRoleGranted(event: RoleGrantedEvent): void {

  let role = Role.load(event.params.role.toHex())
  if (role === null) {
    role = new Role(event.params.role.toHex())
  }

  let roleGrantedEntity = RoleGranted.load(event.transaction.hash.toHex())
  if (roleGrantedEntity === null) {
    roleGrantedEntity = new RoleGranted(
      event.transaction.hash.toHex() + "-" + event.logIndex.toString()
    )
  }

  roleGrantedEntity.role = event.params.role
  roleGrantedEntity.account = event.params.account
  roleGrantedEntity.sender = event.params.sender
  
  let accounts = role.accounts

  if (roleGrantedEntity.role.toHexString() == role.id.toString()) {
    accounts.push(roleGrantedEntity.account)
    role.accounts = accounts
  }

  role.save()
  roleGrantedEntity.save()
}

export function handleRoleRevoked(event: RoleRevokedEvent): void {
  let role = Role.load(event.params.role.toHex())
  if (role === null) {
    role = new Role(event.params.role.toHex())
  }  

  let roleRevokedEntity = RoleRevoked.load(event.transaction.hash.toHex())
  if (roleRevokedEntity === null) {
    roleRevokedEntity = new RoleRevoked(
      event.transaction.hash.toHex() + "-" + event.logIndex.toString()
    )
  }
  roleRevokedEntity.role = event.params.role
  roleRevokedEntity.account = event.params.account
  roleRevokedEntity.sender = event.params.sender

  let accounts = role.accounts

  if (roleRevokedEntity.role.toHexString() == role.id.toString()) {
    accounts.push(roleRevokedEntity.account)
    role.accounts = accounts
  }

  role.save()
  roleRevokedEntity.save()
}

export function handleUnpaused(event: UnpausedEvent): void {
  let unPausedEntity = Unpaused.load(event.transaction.hash.toHex())
  if (unPausedEntity === null) {
    unPausedEntity = new Unpaused(
      event.transaction.hash.toHex() + "-" + event.logIndex.toString()
    )
  }
  unPausedEntity.account = event.params.account
  unPausedEntity.save()
}
