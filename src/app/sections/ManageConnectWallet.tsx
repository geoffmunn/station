import { useTranslation } from "react-i18next"
import UsbIcon from "@mui/icons-material/Usb"
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline"
import SettingsBackupRestoreIcon from "@mui/icons-material/SettingsBackupRestore"
import KeyIcon from "@mui/icons-material/Key"
import GroupsIcon from "@mui/icons-material/Groups"
import { useWallet } from "@terra-rebels/wallet-provider"
import { STATION } from "config/constants"
import { RenderButton } from "types/components"
import { ExternalLink } from "components/general"
import { List } from "components/display"
import { FormHelp } from "components/form"
import { useAuth } from "auth"

import styles from "./ManageConnectWallet.module.scss"

interface Props {
  renderButton?: RenderButton
}

const ConnectWallet = ({ renderButton }: Props) => {
  const { t } = useTranslation()

  const { connect, availableConnections, availableInstallations } = useWallet()
  const { available } = useAuth()

  const extensionList = [
    ...availableConnections.map(({ type, identifier, name, icon }) => ({
      src: icon,
      children: name,
      onClick: () => connect(type, identifier),
    })),
    {
      icon: <UsbIcon />,
      to: "/auth/ledger",
      children: t("Access with ledger"),
    },
    ...availableInstallations.map(({ name, icon, url }) => ({
      src: icon,
      children: t(`Install ${name}`),
      href: url,
    })),
  ]

  const connectionList = [
    {
      icon: <AddCircleOutlineIcon />,
      to: "/auth/new",
      children: t("New wallet"),
    },
    {
      icon: <SettingsBackupRestoreIcon />,
      to: "/auth/recover",
      children: t("Recover wallet"),
    },
    {
      icon: <KeyIcon />,
      to: "/auth/import",
      children: t("Import wallet"),
    },
    {
      icon: <GroupsIcon />,
      to: "/auth/multisig/new",
      children: t("New multisig wallet"),
    },
  ]

  return (
    <>
      <div className={styles.ConnectItem}>
        <List list={connectionList} />
      </div>
      <div className={styles.ConnectItem}>
        <List list={available.length ? available : extensionList} />
      </div>
      {!!available.length && (
        <FormHelp>
          Use <ExternalLink href={STATION}>Rebel Station</ExternalLink> on the
          browser to access with Ledger device
        </FormHelp>
      )}
    </>
  )
}

export default ConnectWallet
