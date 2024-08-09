import React, { useEffect, useState } from "react";
import GenerateUserKey from "./nillion/components/GenerateUserKey";
import CreateClient from "./nillion/components/CreateClient";
import * as nillion from "@nillion/client-web";
 
import { NillionClient, NadaValues } from "@nillion/client-web";
import StoreSecretForm from "./nillion/components/StoreSecretForm";
import StoreProgram from "./nillion/components/StoreProgramForm";
import ComputeForm from "./nillion/components/ComputeForm";
import ConnectionInfo from "./nillion/components/ConnectionInfo";
 
export default function Main() {
  const programName = "guess_the_number";
  const outputRow = "target_row";
  const outputColumn = "target_col";
  const partyName = "searcher";
  const partyName2 = "gamemaker";
  const [userkey, setUserKey] = useState<string | null>(null);
  const [client, setClient] = useState<NillionClient | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [partyId, setPartyId] = useState<string | null>(null);
  const [targetValueStoreId, setTargetValueStoreId] = useState<string | null>(
    null
  );
  const [boardStoreIds, setBoardStoreIds] = useState<string[]>([]);
  const [programId, setProgramId] = useState<string | null>(null);
  const [additionalComputeValues, setAdditionalComputeValues] =
    useState<NadaValues | null>(null);
  const [computeResult, setComputeResult] = useState<any | null>(null);
  const [computeResult2, setComputeResult2] = useState<any | null>(null);
  const [randval, setRandVal] = useState<number | null>(null);

  useEffect(() => {
    if (userkey && client) {
      setUserId(client.user_id);
      setPartyId(client.party_id);
      const additionalComputeValues = new nillion.NadaValues();
      setAdditionalComputeValues(additionalComputeValues);
    }
  }, [userkey, client, targetValueStoreId]);
 
  return (
    <div>
      <h1>Guess the Number Demo</h1>
      <p>
        Connect to Nillion with a user key, then follow the steps to store the
        program, store the target value, and store the game board.
      </p>
      <ConnectionInfo client={client} userkey={userkey} />
 
      <h1>1. Connect to Nillion Client {client && " ✅"}</h1>
      <GenerateUserKey setUserKey={setUserKey} />
 
      {userkey && <CreateClient userKey={userkey} setClient={setClient} />}
      <br />
      <h1>2. Store Program {programId && " ✅"}</h1>
      {client && (
        <>
          <StoreProgram
            nillionClient={client}
            defaultProgram={programName}
            onNewStoredProgram={(program) => setProgramId(program.program_id)}
          />
        </>
      )}
      <br />
      <h1>3. Store Target Value {targetValueStoreId && " ✅"}</h1>
      {userId && programId && (
        <>
          <StoreSecretForm
            secretName={"target_value"}
            onNewStoredSecret={(secret) =>
              {setTargetValueStoreId(secret.storeId);
                setRandVal(Math.floor(Math.random() * 4));
              }
            }
            nillionClient={client}
            secretType="SecretInteger"
            isLoading={false}
            itemName=""
            hidePermissions
            defaultUserWithComputePermissions={userId}
            defaultProgramIdForComputePermissions={programId}
            matrixBoard={true}
          />
        </>
      )}
      <br />

      <h1>4. Store Game Board {boardStoreIds.length === 4 && " ✅"}</h1>
      {userId && programId && (
        <>
          {[...Array(4)].map((_, index) => (
            <StoreSecretForm
              key={index}
              secretName={`board_r${Math.floor(index / 2)}_c${index % 2}`}
              onNewStoredSecret={(secret) =>
                setBoardStoreIds((prev) => [...prev, secret.storeId])
              }
              nillionClient={client}
              secretType="SecretInteger"
              isLoading={false}
              itemName=""
              hidePermissions
              defaultUserWithComputePermissions={userId}
              defaultProgramIdForComputePermissions={programId}
              val={randval}
            />
          ))}
        </>
      )}

      <h1>5. Compute {computeResult && " ✅"}</h1>
      {client &&
        programId &&
        targetValueStoreId &&
        boardStoreIds.length === 4 &&
        partyId &&
        additionalComputeValues && (
          <ComputeForm
            nillionClient={client}
            programId={programId}
            additionalComputeValues={additionalComputeValues}
            storeIds={[targetValueStoreId, ...boardStoreIds]}
            inputParties={[
              { partyName: partyName, partyId: partyId },
              { partyName: partyName2, partyId: partyName2 }
            ]}
            outputParties={[{ partyName, partyId }]}
            outputName = {outputRow}
            onComputeProgram={(result) => setComputeResult(result.value)}
          />
        )}
        {client &&
        programId &&
        targetValueStoreId &&
        boardStoreIds.length === 4 &&
        partyId &&
        additionalComputeValues && (
          <ComputeForm
            nillionClient={client}
            programId={programId}
            additionalComputeValues={additionalComputeValues}
            storeIds={[targetValueStoreId, ...boardStoreIds]}
            inputParties={[
              { partyName: partyName, partyId: partyId },
              { partyName: partyName2, partyId: partyName2 }
            ]}
            outputParties={[{ partyName, partyId }]}
            outputName = {outputColumn}
            onComputeProgram={(result) => setComputeResult2(result.value)}
          />
        )}
      <br />
      {computeResult && (
        <>
          <h2>Result</h2>
          <p>
            Target value found at: 
            Row : {computeResult}
          </p>
        </>
      )}
    </div>
  );
}