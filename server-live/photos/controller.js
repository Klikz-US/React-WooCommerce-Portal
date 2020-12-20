exports.add = (req, res) => {
  try {
    let localFile = `./../uploads/photo/${req.body.name}`;
    let remoteFile = `/wp-content/uploads/products/${req.body.name}`;

    let Client = require("ssh2-sftp-client");
    let sftp = new Client();

    sftp
      .connect({
        host: "cleanairportal.sftp.wpengine.com",
        port: "2222",
        username: "cleanairportal-mj",
        password: "Ldm.8.17",
      })
      .then(() => {
        return sftp.put(localFile, remoteFile);
      })
      .then((data) => {
        res.json(data);
      })
      .catch((err) => {
        res.status(404).send(err);
      });
  } catch (error) {
    res.status(500).send(error);
  }
};
