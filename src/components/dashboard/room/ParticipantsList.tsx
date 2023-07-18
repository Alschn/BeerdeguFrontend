import { type ListProps, List } from "@mantine/core";
import type { UserObject } from "~/api/types";

interface ParticipantsListProps extends Omit<ListProps, 'children'> {
  data: UserObject[];
}

const ParticipantsList = ({ data, ...rest }: ParticipantsListProps) => {
  return (
    <List type="ordered" spacing="xs" size="md" {...rest}>
      {data.map((user) => (
        <List.Item key={`participant-${user.id}`}>{user.username}</List.Item>
      ))}
    </List>
  );
};

export default ParticipantsList;
