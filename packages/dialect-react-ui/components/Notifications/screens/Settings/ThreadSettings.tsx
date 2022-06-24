import {
  Backend,
  useDialectDapp,
  useDialectSdk,
  useThread,
} from '@dialectlabs/react-sdk';
import { useTheme } from '../../../common/providers/DialectThemeProvider';
import { Button, ValueRow } from '../../../common';
import { A, P } from '../../../common/preflighted';
import clsx from 'clsx';
import { getExplorerAddress } from '../../../../utils/getExplorerAddress';
import { display } from '@dialectlabs/web3';

interface ThreadSettingsProps {
  onThreadDelete: () => void;
}

const NotificationsThreadSettings = ({
  onThreadDelete,
}: ThreadSettingsProps) => {
  const {
    textStyles,
    xPaddedText,
    secondaryDangerButton,
    secondaryDangerButtonLoading,
  } = useTheme();

  const {
    info: {
      config: { solana: { network } = {} },
    },
  } = useDialectSdk();

  const { dappAddress } = useDialectDapp();

  const { thread, isDeletingThread, errorDeletingThread, isAdminable } =
    useThread({
      findParams: { otherMembers: dappAddress ? [dappAddress] : [] },
    });

  if (!thread) {
    return null;
  }

  const isOnChain = thread.backend === Backend.Solana;

  return (
    <div>
      {isOnChain ? (
        <ValueRow
          label={
            <>
              <P className={clsx(textStyles.small, 'dt-opacity-60')}>
                Notifications account address
              </P>
              <P>
                <A
                  target="_blank"
                  href={getExplorerAddress(
                    thread.id.address.toBase58(),
                    network
                  )}
                  rel="noreferrer"
                  title={thread.id.address.toBase58()}
                >
                  {display(thread.id.address)}↗
                </A>
              </P>
            </>
          }
          className="dt-mt-1 dt-mb-2"
        >
          <span className="dt-text-right">
            <P className={clsx(textStyles.small, 'dt-opacity-60')}>
              Deposited Rent
            </P>
            <P>0.058 SOL</P>
          </span>
        </ValueRow>
      ) : null}
      {isAdminable ? (
        <>
          <div>
            <Button
              className="dt-w-full"
              defaultStyle={secondaryDangerButton}
              loadingStyle={secondaryDangerButtonLoading}
              onClick={onThreadDelete}
              loading={isDeletingThread}
            >
              {isOnChain ? 'Withdraw rent and delete history' : 'Delete thread'}
            </Button>
            <P
              className={clsx(
                textStyles.small,
                xPaddedText,
                'dt-opacity-50 dt-mt-2'
              )}
            >
              Notification history will be lost forever
            </P>
          </div>
          {errorDeletingThread &&
          errorDeletingThread.type !== 'DISCONNECTED_FROM_CHAIN' ? (
            <P
              className={clsx(
                textStyles.small,
                xPaddedText,
                'dt-text-red-500 dt-mt-2'
              )}
            >
              {errorDeletingThread.message}
            </P>
          ) : null}
        </>
      ) : null}
    </div>
  );
};

export default NotificationsThreadSettings;
