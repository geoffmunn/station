import { useTranslation } from "react-i18next"
import UsbIcon from "@mui/icons-material/Usb"
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline"
import SettingsBackupRestoreIcon from "@mui/icons-material/SettingsBackupRestore"
import KeyIcon from "@mui/icons-material/Key"
import GroupsIcon from "@mui/icons-material/Groups"
import { useWallet } from "@terra-rebels/wallet-provider"
import { STATION } from "config/constants"
import { RenderButton } from "types/components"
import { useAddress } from "data/wallet"
import { Button, ExternalLink } from "components/general"
import { Grid } from "components/layout"
import { List } from "components/display"
import { ModalButton } from "components/feedback"
import { FormHelp } from "components/form"
import { useAuth } from "auth"
import SwitchWallet from "auth/modules/select/SwitchWallet"
import Connected from "./Connected"

interface Props {
  renderButton?: RenderButton
}

const ConnectWallet = ({ renderButton }: Props) => {
  const { t } = useTranslation()

  const { connect, availableConnections, availableInstallations } = useWallet()
  const { available } = useAuth()

  const address = useAddress()
  if (address) return <Connected />

  const defaultRenderButton: Props["renderButton"] = (open) => (
    <Button onClick={open} size="small" outline>
      {t("Connect")}
    </Button>
  )

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
    <ModalButton
      title={t("Connect wallet")}
      renderButton={renderButton ?? defaultRenderButton}
      maxHeight
    >
      <Grid gap={20}>
        <List list={connectionList} />
        <SwitchWallet />
        <List list={available.length ? available : extensionList} />
        {!!available.length && (
          <FormHelp>
            Use <ExternalLink href={STATION}>Rebel Station</ExternalLink> on the
            browser to access with Ledger device
          </FormHelp>
        )}
      </Grid>
    </ModalButton>
  )
}

export default ConnectWallet
