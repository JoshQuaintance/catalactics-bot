export default interface RoleType {
    serverName: string,
	roleName: string,
	roleId: string,
	rawPosition: number,
	userNum: number,
    desc: string,
    save: (err: any) => void;
}
