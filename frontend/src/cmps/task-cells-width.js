export const getColumnWidth = (columnName) =>
{
    if(columnName.includes('text')){
        return 'text-cell-width'

    }else{
        switch (columnName) {
            case 'checkBox':
                return 'checkbox-cell-width'
            case 'lastUpdated':
                return 'last-updated-cel-width'
            case 'dropdown':
                return 'dropdown-cell-width'
            default:
                return ''
        }
    }
}