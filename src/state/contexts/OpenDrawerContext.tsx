import React, {createContext, Dispatch, useState} from 'react';

type OpenDrawerContextType = {
  open: boolean;
  setOpen: Dispatch<boolean>;
  setActive: Dispatch<string>;
  active: string;
};

export const OpenDrawerContext = createContext<OpenDrawerContextType>({
  open: false, // Default state: sidebar is closed.
  setOpen: () => {}, // Default setter function for open status.
  active: 'home', // Default active item: home.
  setActive: () => {}, // Default setter function for active item.
});

/**
 * Provider component for the OpenDrawerContext.
 * Manages the open/close status and active item of the sidebar.
 *
 * @component OpenDrawerProvider
 * @param {ProviderProps} props - The properties passed to the provider.
 * @param {React.ReactNode} props.children - The child components wrapped by the provider.
 * @returns {React.ReactElement} A React element wrapping the child components with the OpenDrawerContext.
 */
export const OpenDrawerProvider = ({children}: {children: React.ReactNode}): React.ReactElement => {
  const [open, setOpen] = useState<boolean>(false);
  const [active, setActive] = useState<string>('home');
  return (
    <OpenDrawerContext.Provider value={{open, setOpen, active, setActive}}>
      {children}
    </OpenDrawerContext.Provider>
  );
};
