import * as Icons from "react-icons/all";

/*Icon name from database data passed as prop*/
export const DynamicFaIcon = ({ name }) => {
  const IconComponent = Icons[name];

  if (!IconComponent) { // Return string
    return name;
  }

  return <IconComponent />;
};
