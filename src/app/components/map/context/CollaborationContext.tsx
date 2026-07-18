'use client';

import React, { createContext, useContext, useReducer, ReactNode } from 'react';

export type OperatorStatus = 'Available' | 'Busy' | 'Idle' | 'Offline';

export interface CollaborationOperator {
  id: string;
  name: string;
  department: string;
  color: string;
  status: OperatorStatus;
  cursor: { x: number; y: number } | null;
  selection: string | null;
  viewport: { x: number; y: number; zoom: number };
}

export interface CommandFeedEvent {
  id: string;
  timestamp: number;
  operatorId?: string;
  department: string;
  message: string;
  type: 'action' | 'approval' | 'system' | 'chat';
}

export interface TacticalAnnotation {
  id: string;
  type: 'path' | 'circle' | 'rect';
  points: { x: number; y: number }[];
  color: string;
  operatorId: string;
  timestamp: number;
}

export interface CollaborationState {
  operators: CollaborationOperator[];
  sharedAnnotations: TacticalAnnotation[];
  commandFeed: CommandFeedEvent[];
  followedOperatorId: string | null;
  watchMode: boolean;
}

type CollaborationAction =
  | { type: 'SET_OPERATORS'; payload: CollaborationOperator[] }
  | { type: 'ADD_COMMAND_EVENT'; payload: CommandFeedEvent }
  | { type: 'ADD_ANNOTATION'; payload: TacticalAnnotation }
  | { type: 'REMOVE_ANNOTATION'; payload: string }
  | { type: 'SET_FOLLOWED_OPERATOR'; payload: string | null }
  | { type: 'TOGGLE_WATCH_MODE'; payload: boolean };

const initialState: CollaborationState = {
  operators: [],
  sharedAnnotations: [],
  commandFeed: [],
  followedOperatorId: null,
  watchMode: false,
};

function collaborationReducer(
  state: CollaborationState,
  action: CollaborationAction
): CollaborationState {
  switch (action.type) {
    case 'SET_OPERATORS':
      return { ...state, operators: action.payload };
    case 'ADD_COMMAND_EVENT':
      return { ...state, commandFeed: [action.payload, ...state.commandFeed].slice(0, 100) };
    case 'ADD_ANNOTATION':
      return { ...state, sharedAnnotations: [...state.sharedAnnotations, action.payload] };
    case 'REMOVE_ANNOTATION':
      return {
        ...state,
        sharedAnnotations: state.sharedAnnotations.filter((a) => a.id !== action.payload),
      };
    case 'SET_FOLLOWED_OPERATOR':
      return {
        ...state,
        followedOperatorId: action.payload,
        watchMode: action.payload ? true : state.watchMode,
      };
    case 'TOGGLE_WATCH_MODE':
      return {
        ...state,
        watchMode: action.payload,
        followedOperatorId: action.payload ? state.followedOperatorId : null,
      };
    default:
      return state;
  }
}

const CollaborationContext = createContext<{
  collabState: CollaborationState;
  collabDispatch: React.Dispatch<CollaborationAction>;
}>({
  collabState: initialState,
  collabDispatch: () => null,
});

export function CollaborationProvider({ children }: { children: ReactNode }) {
  const [collabState, collabDispatch] = useReducer(collaborationReducer, initialState);

  const contextValue = React.useMemo(
    () => ({ collabState, collabDispatch }),
    [collabState, collabDispatch]
  );

  return (
    <CollaborationContext.Provider value={contextValue}>{children}</CollaborationContext.Provider>
  );
}

export function useCollaboration() {
  return useContext(CollaborationContext);
}
