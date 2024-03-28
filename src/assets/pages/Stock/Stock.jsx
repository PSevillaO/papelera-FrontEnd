import { useMemo, useState } from 'react';
import {
  MaterialReactTable,
  // createRow,
  useMaterialReactTable,
} from 'material-react-table';
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  QueryClient,
  QueryClientProvider,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
// import { fakeData, usStates } from './makeData';
import DeleteIcon from '@mui/icons-material/Delete';
// import axios from 'axios';

const Example = () => {
  const [validationErrors, setValidationErrors] = useState({});
  //keep track of rows that have been edited
  const [editedUsers, setEditedUsers] = useState({});
  // const [filteredData, setFilteredData] = useState([]);

  const columns = useMemo(
    () => [
      {
        accessorKey: 'articulo', // Updated: Removed 'filteredData.'
        header: 'Articulo',
        size: 50,
        muiEditTextFieldProps: ({ cell, row }) => ({
          type: 'text',
          required: false,
          error: !!validationErrors?.[cell.id],
          helperText: validationErrors?.[cell.id],
          value: row.original.articulo !== null ? row.original.articulo : '',
          onChange:(event) =>{
            console.log(cell, row)
          },

          //store edited user in state to be saved later
          onBlur: (event) => {
            const validationError = !validateRequired(event.currentTarget.value)
              ? 'Required'
              : undefined;
            setValidationErrors({
              ...validationErrors,
              [cell.id]: validationError,
            });
            setEditedUsers({ ...editedUsers, [row.id]: row.original });
          },
        }),
    
      },
            // {
      // accessorKey: 'category_name',
      // header: 'Category',
      // size: 150,
      // },
      // {
      // accessorKey: 'detalle',
      // header: 'Detalle'
      // size: 200,
      // },
      {
        accessorKey: 'nombre',
        header: 'Nombre',
        size: 150,
        muiEditTextFieldProps: ({ cell, row }) => ({
          type: 'text',
          required: true,
          error: !!validationErrors?.[cell.id],
          helperText: validationErrors?.[cell.id],
          //store edited user in state to be saved later
          onBlur: (event) => {
            const validationError = !validateRequired(event.currentTarget.value)
              ? 'Required'
              : undefined;
            setValidationErrors({
              ...validationErrors,
              [cell.id]: validationError,
            });
            setEditedUsers({ ...editedUsers, [row.id]: row.original });
          },
        }),
      },
      // {
      // accessorKey: 'presentacion',
      // header: 'Presentacion',
      // size: 150,
      // },
      // {
      // accessorKey: 'price',
      // header: 'Price',
      // size: 150,
      // },
      // {
      // accessorKey: 'product_id',
      // header: 'Product ID',
      // size: 150,
      // },
      // {
      // accessorKey: 'unidad',
      // header: 'Unidad',
      // size: 150,
      // },
    ],
    [editedUsers, validationErrors],
  );


  //call CREATE hook
  const { mutateAsync: createUser, isPending: isCreatingUser } =
    useCreateUser();
  //call READ hook
  const {
    data: fetchedUsers = [],
    isError: isLoadingUsersError,
    isFetching: isFetchingUsers,
    isLoading: isLoadingUsers,
  } = useGetUsers();
  //call UPDATE hook
  const { mutateAsync: updateUsers, isPending: isUpdatingUsers } =
    useUpdateUsers();
  //call DELETE hook
  const { mutateAsync: deleteUser, isPending: isDeletingUser } =
    useDeleteUser();

  //CREATE action
  const handleCreateUser = async ({ values, table }) => {
    const newValidationErrors = validateUser(values);
    if (Object.values(newValidationErrors).some((error) => error)) {
      setValidationErrors(newValidationErrors);
      return;
    }
    setValidationErrors({});
    await createUser(values);
    table.setCreatingRow(null); //exit creating mode
  };

  //UPDATE action
  const handleSaveUsers = async () => {
    if (Object.values(validationErrors).some((error) => !!error)) return;
    await updateUsers(Object.values(editedUsers));
    setEditedUsers({});
  };

  //DELETE action
  const openDeleteConfirmModal = (row) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      deleteUser(row.original.id);
    }
  };

  const table = useMaterialReactTable({
    columns,
    data: fetchedUsers,
    createDisplayMode: 'row', // ('modal', and 'custom' are also available)
    editDisplayMode: 'table', // ('modal', 'row', 'cell', and 'custom' are also
    enableEditing: true,
    enableRowActions: true,
    positionActionsColumn: 'last',
    getRowId: (row) => row.id,
    muiToolbarAlertBannerProps: isLoadingUsersError
      ? {
        color: 'error',
        children: 'Error loading data',
      }
      : undefined,
    muiTableContainerProps: {
      sx: {
        minHeight: '500px',
      },
    },
    onCreatingRowCancel: () => setValidationErrors({}),
    onCreatingRowSave: handleCreateUser,
    renderRowActions: ({ row }) => (
      <Box sx={{ display: 'flex', gap: '1rem' }}>
        <Tooltip title="Delete">
          <IconButton color="error" onClick={() => openDeleteConfirmModal(row)}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </Box>
    ),
    renderBottomToolbarCustomActions: () => (
      <Box sx={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <Button
          color="success"
          variant="contained"
          onClick={handleSaveUsers}
          disabled={
            Object.keys(editedUsers).length === 0 ||
            Object.values(validationErrors).some((error) => !!error)
          }
        >
          {isUpdatingUsers ? <CircularProgress size={25} /> : 'Save'}
        </Button>
        {Object.values(validationErrors).some((error) => !!error) && (
          <Typography color="error">Fix errors before submitting</Typography>
        )}
      </Box>
    ),
    renderTopToolbarCustomActions: ({ table }) => (
      <Button
        variant="contained"
        onClick={() => {
          table.setCreatingRow(true); //simplest way to open the create row modal with no default values
          //or you can pass in a row object to set default values with the `createRow` helper function
          // table.setCreatingRow(
          //   createRow(table, {
          //     //optionally pass in default values for the new row, useful for nested data or other complex scenarios
          //   }),
          // );
        }}
      >
        Create New User
      </Button>
    ),
    state: {
      isLoading: isLoadingUsers,
      isSaving: isCreatingUser || isUpdatingUsers || isDeletingUser,
      showAlertBanner: isLoadingUsersError,
      showProgressBars: isFetchingUsers,
    },
  });

  return <MaterialReactTable table={table} />;
};

//CREATE hook (post new user to api)
function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newUserInfo) => {
      try {
        // Realiza la llamada a la API real aquí para crear el usuario
        const response = await fetch('http://localhost:4000/api/createUser', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newUserInfo),
        });

        // Verifica si la respuesta es exitosa (código de estado 200)
        if (!response.ok) {
          throw new Error('Error creating user through the API');
        }

        // Devuelve una promesa resuelta
        return Promise.resolve();
      } catch (error) {
        // Maneja los errores de la llamada a la API
        console.error('Error creating user through the API:', error);
        throw error; // Puedes personalizar cómo manejar los errores según tus necesidades
      }
    },
    // client side optimistic update
    onMutate: (newUserInfo) => {
      // Actualiza de forma optimista el estado local antes de la confirmación de la API
      queryClient.setQueryData(['users'], (prevUsers) => [
        ...prevUsers,
        {
          ...newUserInfo,
          id: (Math.random() + 1).toString(36).substring(7),
        },
      ]);
    },
    // onSettled: () => queryClient.invalidateQueries({ queryKey: ['users'] }), // descomenta para refrescar los usuarios después de la mutación, desactivado para la demo
  });
}

//READ hook (get users from api)
function useGetUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      try {
        // Realiza la llamada a la API real aquí
        const response = await fetch('http://localhost:4000/api/products');

        // Verifica si la respuesta es exitosa (código de estado 200)
        if (!response.ok) {
          throw new Error('Error fetching data from the API');
        }

        // Parsea la respuesta como JSON
        const data = await response.json();

        // Devuelve los datos obtenidos de la API
        return data;
      } catch (error) {
        // Maneja los errores de la llamada a la API
        console.error('Error fetching data from the API:', error);
        throw error; // Puedes personalizar cómo manejar los errores según tus necesidades
      }
    },
    refetchOnWindowFocus: false,
  });
}

//UPDATE hook (put user in api)
// Importa las dependencias necesarias, incluyendo useMutation
// UPDATE hook (update users through api)
function useUpdateUsers() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newUsers) => {
      try {
        // Realiza la llamada a la API real aquí para actualizar usuarios
        const response = await fetch('http://localhost:4000/api/updateUsers', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newUsers),
        });

        // Verifica si la respuesta es exitosa (código de estado 200)
        if (!response.ok) {
          throw new Error('Error updating users through the API');
        }

        // Devuelve una promesa resuelta
        return Promise.resolve();
      } catch (error) {
        // Maneja los errores de la llamada a la API
        console.error('Error updating users through the API:', error);
        throw error; // Puedes personalizar cómo manejar los errores según tus necesidades
      }
    },
    // client side optimistic update
    onMutate: (newUsers) => {
      // Actualiza de forma optimista el estado local antes de la confirmación de la API
      queryClient.setQueryData(['users'], (prevUsers) =>
        prevUsers?.map((user) => {
          const newUser = newUsers.find((u) => u.id === user.id);
          return newUser ? newUser : user;
        }),
      );
    },
    // onSettled: () => queryClient.invalidateQueries({ queryKey: ['users'] }), // descomenta para refrescar los usuarios después de la mutación, desactivado para la demo
  });
}


//DELETE hook (delete user in api)
function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId) => {
      try {
        // Realiza la llamada a la API real aquí para eliminar el usuario
        const response = await fetch(`http://localhost:4000/api/deleteUser/${userId}`, {
          method: 'DELETE',
        });

        // Verifica si la respuesta es exitosa (código de estado 200)
        if (!response.ok) {
          throw new Error('Error deleting user through the API');
        }

        // Devuelve una promesa resuelta
        return Promise.resolve();
      } catch (error) {
        // Maneja los errores de la llamada a la API
        console.error('Error deleting user through the API:', error);
        throw error; // Puedes personalizar cómo manejar los errores según tus necesidades
      }
    },
    // client side optimistic update
    onMutate: (userId) => {
      // Actualiza de forma optimista el estado local antes de la confirmación de la API
      queryClient.setQueryData(['users'], (prevUsers) =>
        prevUsers?.filter((user) => user.id !== userId),
      );
    },
    // onSettled: () => queryClient.invalidateQueries({ queryKey: ['users'] }), // descomenta para refrescar los usuarios después de la mutación, desactivado para la demo
  });
}
const queryClient = new QueryClient();

const ExampleWithProviders = () => (
  //Put this with your other react-query providers near root of your app
  <QueryClientProvider client={queryClient}>
    <Example />
  </QueryClientProvider>
);

export default ExampleWithProviders;

const validateRequired = (value) => value !== null && value !== undefined && !!value.length;


const validateEmail = (email) =>
  !!email.length &&
  email
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    );

function validateUser(user) {
  return {
    firstName: !validateRequired(user.firstName)
      ? 'First Name is Required'
      : '',
    lastName: !validateRequired(user.lastName) ? 'Last Name is Required' : '',
    email: !validateEmail(user.email) ? 'Incorrect Email Format' : '',
  };
}
