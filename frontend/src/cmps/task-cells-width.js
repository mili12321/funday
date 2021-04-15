export const getColumnWidth = (columnName) =>
{
    switch (columnName) {
        case 'checkBox':
            return 'checkbox-cell-width'
        case 'lastUpdated':
            return 'last-updated-cel-width'
        case 'text':
            return 'text-cell-width'
        case 'dropdown':
            return 'dropdown-cell-width'
        default:
            return ''
    }
}