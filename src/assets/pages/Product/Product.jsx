import { useMemo } from 'react';
import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import { useState, useEffect } from 'react';
import axios from 'axios';


const Example = () => {
  const [validationErrors, setValidationErrors] = useState({});
  const [filteredData, setFilteredData] = useState([]);
  const [editedUsers, setEditedUsers] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/products');
        setFilteredData(response.data);
        console.log(response)

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);
  

  //should be memoized or stable
  const columns = useMemo( 
    () => [
      {
        accessorKey: 'articulo', // Updated: Removed 'filteredData.'
        header: 'Articulo',
        size: 150,
      },
      {
        accessorKey: 'category_name',
        header: 'Category',
        size: 150,
      },
      {
        accessorKey: 'detalle',
        header: 'Detalle',
        size: 200,
      },
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
      {
        accessorKey: 'presentacion',
        header: 'Presentacion',
        size: 150,
      },
      {
        accessorKey: 'price',
        header: 'Price',
        size: 150,
      },
      {
        accessorKey: 'product_id',
        header: 'Product ID',
        size: 150,
      },
      {
        accessorKey: 'unidad',
        header: 'Unidad',
        size: 150,
      },
    ],
    // [],
  );

  const table = useMaterialReactTable({
    columns,
    data: filteredData, // 'filteredData' directly without any modification
    createDisplayMode: 'row', // ('modal', and 'custom' are also available)
    editDisplayMode: 'table', // ('modal', 'row', 'cell', and 'custom' are also
    enableEditing: true, 
    enableRowActions: true,
    positionActionsColumn: 'last', 
    
  });

  return <MaterialReactTable table={table} />;
};

export default Example;

const validateRequired = (value) => !!value.length;
