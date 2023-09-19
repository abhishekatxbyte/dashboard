import * as XLSX from 'xlsx';
import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { ADD_DATA } from '../store/slice';

const File = () => {
    const data = useSelector(state => state.data.data)
    const dataArray = useSelector(state => state.data.dataArray)

    const dispatch = useDispatch()
    const handleFile = async (e) => {
        const files = e.target.files;
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const data = await file.arrayBuffer();
            const workbook = XLSX.read(data);
            const worksheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(worksheet, {
                header: 1,
                defval: "",
            });

            // Transform the array of arrays into an array of objects
            const headerRow = jsonData[0];
            const formattedData = jsonData.slice(1).map(row => {

                const obj = {};
                headerRow.forEach((key, index) => {
                    obj[key] = row[index];
                    obj.fileName = file.name.replace(/\.[^/.]+$/, "");

                });
                return obj;
            });
            dispatch(ADD_DATA(formattedData))
            console.log(`Data from file ${i + 1}:`, formattedData);
        }
    }
    console.log(data)
    console.log(dataArray)

    return (
        <div>
            <input

                type="file"
                multiple  // This attribute allows multiple file selection
                onInput={(e) => handleFile(e)}
            />
        </div>
    )
}

export default File;
