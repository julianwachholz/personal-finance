import { Input, Spin, Typography } from "antd";
import React, { useState, useTransition } from "react";
import { sleep } from "../../utils";
import ErrorBoundary from "../../utils/ErrorBoundary";
import BaseModule from "../base/BaseModule";

const { Paragraph: P } = Typography;

const fetchPokemon = async (name: string) => {
  await sleep(1500);
  if (name === "error") {
    throw new Error("bad name");
  }
  return `${name}!`;
};

const createResource = (fn: () => Promise<string>) => {
  let status = "pending";
  let result: string;
  let promise = fn().then(
    r => {
      status = "success";
      result = r;
    },
    e => {
      status = "error";
      result = e;
    }
  );
  return {
    read() {
      if (status === "pending") throw promise;
      if (status === "error") throw result;
      return result;
    }
  };
};

interface PokemonProps {
  resource: any;
}

const Pokemon = ({ resource }: PokemonProps) => {
  const pokemon = resource.read();
  return <P>I'm a {pokemon}</P>;
};

const SUSPENSE_CONFIG = {
  timeoutMs: 3000
};

const Dashboard: React.FC = () => {
  const [name, setName] = useState("");
  const [resource, setResource] = useState<any>(null);
  const [startTransition, isPending] = useTransition(SUSPENSE_CONFIG);

  return (
    <BaseModule title="Dashboard">
      <P>I'm a dashboard.</P>
      <Input.Search
        enterButton
        onSearch={value => {
          setName(value);
          startTransition(() => {
            setResource(createResource(() => fetchPokemon(value)));
          });
        }}
      />
      {name ? (
        <ErrorBoundary>
          <React.Suspense fallback={<Spin tip={`Loading ${name}...`} />}>
            <Pokemon resource={resource} />
          </React.Suspense>
        </ErrorBoundary>
      ) : (
        <p>Enter name</p>
      )}
    </BaseModule>
  );
};

export default Dashboard;
