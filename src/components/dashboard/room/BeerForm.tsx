import { Select, SimpleGrid, Textarea } from "@mantine/core";
import { usePrevious } from "@mantine/hooks";
import { type ChangeEvent, useEffect, useReducer } from "react";
import { useWebSocket } from "react-use-websocket/dist/lib/use-websocket";
import type { UserRatingsObject, WebsocketMessage } from "~/api/types";
import { useRoom } from "~/components/context/room";

const FORM_SAVE_INTERVAL_MS = 5_000;

const NOTES_CHOICES = Array.from({ length: 10 })
  .map((_, i) => {
    const num = i + 1;
    const numStr = num.toString();
    return {
      value: numStr,
      label: numStr,
    };
  })
  .reverse();

interface State extends Omit<UserRatingsObject, "note"> {
  note: string;
}

type Action =
  | { type: "INPUT_CHANGE"; field: string; payload: string | number }
  | { type: "FETCH_FORM_DATA"; payload: State };

const initialState = {
  color: "",
  smell: "",
  foam: "",
  taste: "",
  opinion: "",
  note: "",
};

const formReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "INPUT_CHANGE":
      return {
        ...state,
        [action.field]: action.payload,
      };
    case "FETCH_FORM_DATA":
      return {
        ...action.payload,
      };
    default:
      return state;
  }
};

interface BeerFormProps {
  id: number;
}

const BeerForm = ({ id }: BeerFormProps) => {
  const { websocketUrl, token } = useRoom();
  const [state, dispatch] = useReducer(formReducer, initialState);

  const prevState = usePrevious({ ...state, beer_id: id });

  const { sendJsonMessage } = useWebSocket(websocketUrl, {
    queryParams: { token },
    onMessage: (event: MessageEvent<unknown>) => {
      const data = event.data as string;
      try {
        const parsed = JSON.parse(data) as WebsocketMessage;
        if (parsed.command === "set_form_data") {
          dispatch({
            type: "FETCH_FORM_DATA",
            payload: parsed.data as State,
          });
        }
      } catch {
        console.error("Failed to parse websocket message");
      }
    },
    share: true,
  });

  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>): void => {
    dispatch({
      type: "INPUT_CHANGE",
      field: e.target.name,
      payload: e.target.value,
    });
  };

  useEffect(() => {
    // save previous form (if there was one) every time user goes forward/backwards
    // to make sure their input had been saved
    if (prevState) {
      sendJsonMessage({
        command: "user_form_save",
        data: prevState,
      });
    }

    // load current form
    sendJsonMessage({
      command: "get_form_data",
      data: id,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    // save form so that users do not lose fields they filled
    // in case they got disconnected
    const formSaveInterval = setInterval(() => {
      sendJsonMessage({
        command: "user_form_save",
        data: {
          ...state,
          beer_id: id,
        },
      });
    }, FORM_SAVE_INTERVAL_MS);
    return () => clearInterval(formSaveInterval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, id]);

  return (
    <form>
      <SimpleGrid>
        <Textarea
          name="color"
          label="Color"
          placeholder="Color"
          value={state.color}
          onChange={handleInputChange}
        />
        <Textarea
          name="foam"
          label="Foam"
          placeholder="Foam"
          value={state.foam}
          onChange={handleInputChange}
        />
        <Textarea
          name="smell"
          label="Smell"
          placeholder="Smell"
          value={state.smell}
          onChange={handleInputChange}
        />
        <Textarea
          name="taste"
          label="Taste"
          placeholder="Taste"
          minRows={5}
          value={state.taste}
          onChange={handleInputChange}
        />
        <Textarea
          name="opinion"
          label="Opinion"
          placeholder="Opinion"
          minRows={5}
          value={state.opinion}
          onChange={handleInputChange}
        />
        <Select
          name="rating"
          label="Rating"
          placeholder="Rating"
          data={NOTES_CHOICES}
          value={String(state.note || "")}
          onChange={(value) => {
            dispatch({
              type: "INPUT_CHANGE",
              field: "note",
              payload: value || "",
            });
          }}
        />
      </SimpleGrid>
    </form>
  );
};

export default BeerForm;
