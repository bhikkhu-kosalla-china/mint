<?php
# Generated by the protocol buffer compiler.  DO NOT EDIT!
# source: lily.proto

namespace Palm\Lily\V1;

use Google\Protobuf\Internal\GPBType;
use Google\Protobuf\Internal\RepeatedField;
use Google\Protobuf\Internal\GPBUtil;

/**
 * Generated from protobuf message <code>palm.lily.v1.S3GetFileRequest</code>
 */
class S3GetFileRequest extends \Google\Protobuf\Internal\Message
{
    /**
     * Generated from protobuf field <code>string bucket = 1;</code>
     */
    protected $bucket = '';
    /**
     * Generated from protobuf field <code>string name = 2;</code>
     */
    protected $name = '';
    /**
     * Generated from protobuf field <code>.google.protobuf.Duration ttl = 9;</code>
     */
    protected $ttl = null;

    /**
     * Constructor.
     *
     * @param array $data {
     *     Optional. Data for populating the Message object.
     *
     *     @type string $bucket
     *     @type string $name
     *     @type \Google\Protobuf\Duration $ttl
     * }
     */
    public function __construct($data = NULL) {
        \GPBMetadata\Lily::initOnce();
        parent::__construct($data);
    }

    /**
     * Generated from protobuf field <code>string bucket = 1;</code>
     * @return string
     */
    public function getBucket()
    {
        return $this->bucket;
    }

    /**
     * Generated from protobuf field <code>string bucket = 1;</code>
     * @param string $var
     * @return $this
     */
    public function setBucket($var)
    {
        GPBUtil::checkString($var, True);
        $this->bucket = $var;

        return $this;
    }

    /**
     * Generated from protobuf field <code>string name = 2;</code>
     * @return string
     */
    public function getName()
    {
        return $this->name;
    }

    /**
     * Generated from protobuf field <code>string name = 2;</code>
     * @param string $var
     * @return $this
     */
    public function setName($var)
    {
        GPBUtil::checkString($var, True);
        $this->name = $var;

        return $this;
    }

    /**
     * Generated from protobuf field <code>.google.protobuf.Duration ttl = 9;</code>
     * @return \Google\Protobuf\Duration|null
     */
    public function getTtl()
    {
        return $this->ttl;
    }

    public function hasTtl()
    {
        return isset($this->ttl);
    }

    public function clearTtl()
    {
        unset($this->ttl);
    }

    /**
     * Generated from protobuf field <code>.google.protobuf.Duration ttl = 9;</code>
     * @param \Google\Protobuf\Duration $var
     * @return $this
     */
    public function setTtl($var)
    {
        GPBUtil::checkMessage($var, \Google\Protobuf\Duration::class);
        $this->ttl = $var;

        return $this;
    }

}

