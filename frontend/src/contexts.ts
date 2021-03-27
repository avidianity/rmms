import { createContext } from 'react';

export const SearchContext = createContext({
	show: true,
	setShow: (show: boolean) => {},
});
