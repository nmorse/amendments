import React from "react";
import { useMachine } from "@xstate/react";
import { amendmentMachine } from "./AmendmentMachine";
import { diffText } from "./helpers/diffHelper";
import { InState, HandlesEvent } from "./helpers/xstateHelper";
import { Box, 
  Button, 
  Grid, 
  TextArea, Paragraph, Heading 
} from "grommet";

export const Amendment = () => {
  const [current, send] = useMachine(amendmentMachine);

  return (
    <Box direction="row" flex overflow={{ horizontal: "hidden" }}>
      <Box flex align="center" justify="center">
        <Grid
          rows={["medium", "medium"]}
          columns={["large", "small"]}
          gap="small"
          areas={[
            { name: "main", start: [0, 0], end: [0, 0] },
            { name: "actions", start: [1, 0], end: [1, 0] },
            { name: "context", start: [0, 1], end: [0, 1] }
          ]}
        >
          <Box gridArea="main" background="light-5" pad="small">
            <InState state="unaltered" current={current}>
              <Heading margin="none">For Amendment Consideration</Heading>
              <p>{current.context.originalText}</p>
              <Button label="Edit" onClick={() => send("EDIT")} />
              <Button label="Table" onClick={() => send("TABLE")} />
            </InState>
            <InState state="amend.editing" current={current}>
              <Heading margin="none">Edit this Amendment</Heading>
              <TextArea
                onChange={e => send("CHANGE", { value: e.target.value })}
                children={current.context.modifiedText}
              ></TextArea>
              <Button label="Save" onClick={() => send("REVIEW")} />
            </InState>
            <InState state="amend.review" current={current}>
              <Heading margin="none">Review Changes</Heading>
              <p
                className="review"
                dangerouslySetInnerHTML={{
                  __html: diffText(
                    current.context.originalText,
                    current.context.modifiedText
                  )
                }}
              />
              <Button label="Finilize for a vote" onClick={() => send("VOTETOPASS")} />
            </InState>
            <InState state="warnRevert" current={current}>
              <Heading margin="none">Delete All Changes</Heading>
              <div
                className="review"
                dangerouslySetInnerHTML={{
                  __html: diffText(
                    current.context.originalText,
                    current.context.modifiedText
                  )
                }}
              />
              <Button
                label="Discard All Changes"
                onClick={() => send("PROCEED")}
              />
              <Button
              label="Cancel"
              onClick={() => send("CANCEL")}
            />
            </InState>
            <InState state="amend.forApproval" current={current}>
              <Heading margin="none">Amendment Set for Vote</Heading>
              <p>{current.context.modifiedText}</p>
              <div
                className="review"
                dangerouslySetInnerHTML={{
                  __html: diffText(
                    current.context.originalText,
                    current.context.modifiedText
                  )
                }}
              />
            </InState>
            <InState state={["forRetraction", "tabled"]} current={current}>
              <Heading margin="none">Amendment Tabled!</Heading>
              <Paragraph>{current.context.originalText}</Paragraph>
            </InState>
          </Box>

          <Box gridArea="actions" background="light-2">
            <HandlesEvent event="REVERT" current={current}>
              <Button
                label="Discard All Changes"
                onClick={() => send("REVERT")}
              />
            </HandlesEvent>
            <HandlesEvent event="EDIT" current={current}>
              <Button label="Edit" onClick={() => send("EDIT")} />
            </HandlesEvent>
          </Box>

          <Box gridArea="context">
            <pre>context: {JSON.stringify(current.context, null, " ")}</pre>
            <div>Now in state: {JSON.stringify(current.value)}</div>
            <div>
              {current.nextEvents.map(evt => (
                <span>
                  <button onClick={() => send(evt)}>{evt}</button>
                </span>
              ))}
            </div>
          </Box>
        </Grid>
      </Box>
    </Box>
  );
};
