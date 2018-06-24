interface IAuthorsObject {
	music?: string[];
	lyrics?: string[];
}

interface IVariant {
	id: string;
	text: string;
	description: string;
	visibility?: number;
}

interface ISong {
	id: string;
	title: string;
	authors: IAuthorsObject;
	interpreters: string[];
	variants: IVariant[];
}

interface ICreateSong {
	title: string;
	authors: IAuthorsObject;
	interpreters: string[];
	variant: Partial<IVariant>;
}

interface ISongBookSong {
	variantId: number;
	order?: number;
}

interface ISongBook {
	title: string;
	songs: ISongBookSong[];
}

interface IRootStore {
	modules: any;
}

interface ISongListStoreState {
	state: EStateTypes;
	items: ISong[];
	searchQuery?: string;
	page: number;
	perPage: number;
	total: number;
	error?: any;
}

interface IInterpreter {
	id: string;
	name: string;
}

interface IAuthor {
	id: string;
	name: string;
}

interface IInterpreterStoreState {
	state: EStateTypes;
	items: IInterpreter[];
	error?: any;
}

interface IAuthorStoreState {
	state: EStateTypes;
	items: IInterpreter[];
	error?: any;
}

interface ISongStoreState {
	state: EStateTypes;
	song?: ISong;
	error?: any;
}

interface IUserSimple {
	name: string;
	id: string;
}

interface IUser {
	id: string;
	name: string;
	logoutLink: string;
}

interface IUserStoreState {
	state: EStateTypes;
	items: IUserSimple[];
	currentUser?: IUser;
	error?: any;
}

interface ISongListStoreGetters {
	readonly lastPage: number;
	readonly canNext: boolean;
	readonly canPrev: boolean;
}

interface ISelectOption {
	value: any;
	label: string;
}

enum EStateTypes {
	loading,
	failed,
	ready,
}
