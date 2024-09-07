import { useQuery } from '@tanstack/react-query';
import { PersonaControllerService } from '../api';

export const usePersonaList = (forUpdate: boolean) => {
    return useQuery({
        queryKey: ['personaList', forUpdate], 
        queryFn: () => PersonaControllerService.findAll1({query: {forUpdate}}).then(x => x.data)
    });
};

export const usePersonaDetails = (id: string) => {
    return useQuery({
        queryKey: ['personaDetails', id],
        queryFn: () => PersonaControllerService.findById1({path: {id}}).then(x => x.data)
    });
};

export const useMe = () => {
    return useQuery({
        queryKey: ['me'],
        queryFn: () => PersonaControllerService.getMe().then(x => x.data)
    });
};
